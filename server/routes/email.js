import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ── Lazy-load Resend (optional dep) ─────────────────────────────────────────
async function getResendClient() {
  const { Resend } = await import('resend');
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set. Please add it as a secret.');
  return new Resend(key);
}

// ── Lazy-load OpenAI (optional dep) ─────────────────────────────────────────
async function getOpenAI() {
  const { default: OpenAI } = await import('openai');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.');
  return new OpenAI({ apiKey });
}

// ── Create email_logs table ─────────────────────────────────────────────────
export async function ensureEmailLogsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id            SERIAL PRIMARY KEY,
      subject       TEXT         NOT NULL,
      body_html     TEXT         NOT NULL,
      recipient_count INT        NOT NULL DEFAULT 0,
      recipients_json TEXT       NOT NULL DEFAULT '[]',
      sent_by       VARCHAR(255) NOT NULL DEFAULT 'admin',
      status        VARCHAR(20)  NOT NULL DEFAULT 'sent',
      error_msg     TEXT,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}

// ── Helper: resolve recipient groups from DB ────────────────────────────────
async function resolveRecipientGroup(group) {
  // group = { type: 'zoneLeaders'|'cellLeaders'|'deptLeaders'|'zoneId'|'cellId'|'deptId'|'userId', id?: string }
  let rows = [];

  if (group.type === 'zoneLeaders') {
    const r = await pool.query(`
      SELECT DISTINCT u."Email" AS email, u."FirstName" || ' ' || u."LastName" AS name
      FROM "Zones" z
      JOIN "AspNetUsers" u ON u."Id" = z."ZonalPastorId"
      WHERE u."Email" IS NOT NULL AND u."Email" != ''
    `);
    rows = r.rows;
  } else if (group.type === 'cellLeaders') {
    // If zoneId specified, filter by zone
    const r = await pool.query(`
      SELECT DISTINCT u."Email" AS email, u."FirstName" || ' ' || u."LastName" AS name
      FROM "Cells" c
      JOIN "AspNetUsers" u ON u."Id" = c."CellLeaderId"
      WHERE u."Email" IS NOT NULL AND u."Email" != ''
      ${group.zoneId ? `AND c."ZoneId" = $1` : ''}
    `, group.zoneId ? [group.zoneId] : []);
    rows = r.rows;
  } else if (group.type === 'deptLeaders') {
    const r = await pool.query(`
      SELECT DISTINCT u."Email" AS email, u."FirstName" || ' ' || u."LastName" AS name
      FROM "Departments" d
      JOIN "AspNetUsers" u ON u."Id" = d."DepartmentLeaderId"
      WHERE u."Email" IS NOT NULL AND u."Email" != ''
    `);
    rows = r.rows;
  } else if (group.type === 'zone') {
    // All leaders in a specific zone (zonal + cell leaders)
    const r = await pool.query(`
      SELECT DISTINCT u."Email" AS email, u."FirstName" || ' ' || u."LastName" AS name
      FROM "Cells" c
      JOIN "AspNetUsers" u ON u."Id" = c."CellLeaderId"
      WHERE c."ZoneId" = $1 AND u."Email" IS NOT NULL AND u."Email" != ''
      UNION
      SELECT DISTINCT u2."Email", u2."FirstName" || ' ' || u2."LastName"
      FROM "Zones" z
      JOIN "AspNetUsers" u2 ON u2."Id" = z."ZonalPastorId"
      WHERE z."Id" = $1 AND u2."Email" IS NOT NULL AND u2."Email" != ''
    `, [group.id]);
    rows = r.rows;
  } else if (group.type === 'cell') {
    // Cell leader(s) for specific cell
    const r = await pool.query(`
      SELECT DISTINCT u."Email" AS email, u."FirstName" || ' ' || u."LastName" AS name
      FROM "Cells" c
      JOIN "AspNetUsers" u ON u."Id" = c."CellLeaderId"
      WHERE c."Id" = $1 AND u."Email" IS NOT NULL AND u."Email" != ''
    `, [group.id]);
    rows = r.rows;
  } else if (group.type === 'dept') {
    // Department leader(s) for specific dept
    const r = await pool.query(`
      SELECT DISTINCT u."Email" AS email, u."FirstName" || ' ' || u."LastName" AS name
      FROM "Departments" d
      JOIN "AspNetUsers" u ON u."Id" = d."DepartmentLeaderId"
      WHERE d."Id" = $1 AND u."Email" IS NOT NULL AND u."Email" != ''
    `, [group.id]);
    rows = r.rows;
  } else if (group.type === 'user') {
    const r = await pool.query(`
      SELECT "Email" AS email, "FirstName" || ' ' || "LastName" AS name
      FROM "AspNetUsers" WHERE "Id" = $1
    `, [group.id]);
    rows = r.rows;
  }

  return rows.filter(r => r.email);
}

// ── GET /api/local/email/recipients ────────────────────────────────────────
router.get('/recipients', async (_req, res) => {
  try {
    const [zones, cells, depts, users] = await Promise.all([
      pool.query(`
        SELECT z."Id" AS id, z."Name" AS name,
               u."FirstName" || ' ' || u."LastName" AS leader_name, u."Email" AS leader_email
        FROM "Zones" z
        LEFT JOIN "AspNetUsers" u ON u."Id" = z."ZonalPastorId"
        ORDER BY z."Name"
      `),
      pool.query(`
        SELECT c."Id" AS id, c."Name" AS name, z."Name" AS zone_name,
               u."FirstName" || ' ' || u."LastName" AS leader_name, u."Email" AS leader_email
        FROM "Cells" c
        LEFT JOIN "Zones" z ON z."Id" = c."ZoneId"
        LEFT JOIN "AspNetUsers" u ON u."Id" = c."CellLeaderId"
        ORDER BY z."Name", c."Name"
      `),
      pool.query(`
        SELECT d."Id" AS id, d."Name" AS name,
               u."FirstName" || ' ' || u."LastName" AS leader_name, u."Email" AS leader_email
        FROM "Departments" d
        LEFT JOIN "AspNetUsers" u ON u."Id" = d."DepartmentLeaderId"
        ORDER BY d."Name"
      `),
      pool.query(`
        SELECT "Id" AS id,
               "FirstName" || ' ' || "LastName" AS name,
               "Email" AS email
        FROM "AspNetUsers"
        WHERE "Email" IS NOT NULL AND "Email" != ''
        ORDER BY "LastName", "FirstName"
        LIMIT 500
      `)
    ]);

    res.json({
      ok: true,
      data: {
        zones:  zones.rows,
        cells:  cells.rows,
        depts:  depts.rows,
        users:  users.rows
      }
    });
  } catch (err) {
    console.error('[email/recipients]', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/local/email/ai-draft ────────────────────────────────────────
router.post('/ai-draft', async (req, res) => {
  const { prompt, currentContent = '', action = 'generate' } = req.body;
  if (!prompt) return res.status(400).json({ ok: false, error: 'prompt is required' });

  try {
    const openai = await getOpenAI();

    const systemMsg = `You are a church communications assistant for Dominion City VI church.
Your job is to help write professional, warm, and faith-based emails for church leadership communications.
Always write in a respectful, encouraging tone appropriate for a church community.
Return only the email body HTML (using simple inline styles, no external CSS). Do not include <html>, <head>, or <body> tags.`;

    let userMsg;
    if (action === 'generate') {
      userMsg = `Write a church email based on this request: ${prompt}`;
    } else if (action === 'improve') {
      userMsg = `Improve this email based on the following feedback: "${prompt}"\n\nCurrent email:\n${currentContent}`;
    } else if (action === 'shorten') {
      userMsg = `Make this email shorter and more concise while keeping the key message:\n${currentContent}`;
    } else if (action === 'formalize') {
      userMsg = `Make this email more formal and professional:\n${currentContent}`;
    } else {
      userMsg = prompt;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: userMsg }
      ],
      max_tokens: 1200
    });

    const content = completion.choices[0]?.message?.content ?? '';
    res.json({ ok: true, content });
  } catch (err) {
    console.error('[email/ai-draft]', err.message);
    if (err.message.includes('OPENAI_API_KEY')) {
      return res.status(503).json({ ok: false, error: 'AI assistant is not configured yet. Please set up the OpenAI integration.' });
    }
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/local/email/send ────────────────────────────────────────────
router.post('/send', async (req, res) => {
  const { subject, bodyHtml, recipientGroups = [], individualRecipients = [], sentBy = 'admin', attachments = [] } = req.body;
  if (!subject || !bodyHtml) return res.status(400).json({ ok: false, error: 'subject and bodyHtml are required' });

  try {
    // Resolve all recipient groups
    const resolvedSets = await Promise.all(recipientGroups.map(resolveRecipientGroup));
    const allResolved = resolvedSets.flat();

    // Merge individual recipients
    const allRecipients = [...allResolved, ...individualRecipients.filter(r => r.email)];

    // Deduplicate by email
    const seen = new Set();
    const unique = allRecipients.filter(r => {
      if (!r.email || seen.has(r.email.toLowerCase())) return false;
      seen.add(r.email.toLowerCase());
      return true;
    });

    if (unique.length === 0) {
      return res.status(400).json({ ok: false, error: 'No valid recipients resolved.' });
    }

    const resend = await getResendClient();
    const FROM = process.env.EMAIL_FROM ?? 'Dominion City VI <noreply@dominioncityvi.org>';

    // Send in batches of 50 (Resend limit)
    const BATCH = 50;
    const errors = [];
    for (let i = 0; i < unique.length; i += BATCH) {
      const batch = unique.slice(i, i + BATCH);
      const to = batch.map(r => r.name ? `${r.name} <${r.email}>` : r.email);
      try {
        await resend.emails.send({
          from: FROM,
          to,
          subject,
          html: bodyHtml,
          attachments: attachments.map(a => ({
            filename: a.filename,
            content: a.content // base64 string
          }))
        });
      } catch (batchErr) {
        errors.push(batchErr.message);
      }
    }

    // Log to DB
    await pool.query(
      `INSERT INTO email_logs (subject, body_html, recipient_count, recipients_json, sent_by, status, error_msg)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [subject, bodyHtml, unique.length, JSON.stringify(unique), sentBy,
       errors.length === 0 ? 'sent' : 'partial', errors.join('; ') || null]
    );

    res.json({
      ok: true,
      sentCount: unique.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('[email/send]', err.message);
    if (err.message.includes('RESEND_API_KEY')) {
      return res.status(503).json({ ok: false, error: 'Email service is not configured yet. Please add the RESEND_API_KEY secret.' });
    }
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /api/local/email/logs ─────────────────────────────────────────────
router.get('/logs', async (_req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, subject, recipient_count, sent_by, status, error_msg, created_at
       FROM email_logs ORDER BY created_at DESC LIMIT 50`
    );
    res.json({ ok: true, data: r.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
