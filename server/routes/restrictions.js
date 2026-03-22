import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ── Create table on first load ──────────────────────────────────────────────
export async function ensureRestrictionsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance_restrictions (
      id            SERIAL PRIMARY KEY,
      entity_type   VARCHAR(10)  NOT NULL CHECK (entity_type IN ('cell','dept')),
      entity_id     VARCHAR(128) NOT NULL,
      entity_name   VARCHAR(255) NOT NULL DEFAULT '',
      reason        TEXT         NOT NULL DEFAULT '',
      restricted_by VARCHAR(255) NOT NULL DEFAULT 'admin',
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      UNIQUE(entity_type, entity_id)
    )
  `);
}

// ── GET /api/local/restrictions ─────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, entity_type, entity_id, entity_name, reason, restricted_by, created_at
       FROM attendance_restrictions ORDER BY created_at DESC`
    );
    res.json({ ok: true, data: r.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /api/local/restrictions/check/:entityType/:entityId ─────────────────
router.get('/check/:entityType/:entityId', async (req, res) => {
  const { entityType, entityId } = req.params;
  try {
    const r = await pool.query(
      `SELECT id, reason, restricted_by, created_at
       FROM attendance_restrictions
       WHERE entity_type = $1 AND entity_id = $2`,
      [entityType, entityId]
    );
    res.json({ ok: true, restricted: r.rows.length > 0, data: r.rows[0] ?? null });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/local/restrictions ────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { entityType, entityId, entityName = '', reason = '', restrictedBy = 'admin' } = req.body;
  if (!entityType || !entityId) {
    return res.status(400).json({ ok: false, error: 'entityType and entityId are required' });
  }
  try {
    const r = await pool.query(
      `INSERT INTO attendance_restrictions (entity_type, entity_id, entity_name, reason, restricted_by)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (entity_type, entity_id) DO UPDATE
         SET reason = EXCLUDED.reason, restricted_by = EXCLUDED.restricted_by, entity_name = EXCLUDED.entity_name, created_at = NOW()
       RETURNING *`,
      [entityType, entityId, entityName, reason, restrictedBy]
    );
    res.json({ ok: true, data: r.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/local/restrictions/bulk ───────────────────────────────────────
// Restrict many entities at once.
// Body: { entityType, items: [{entityId, entityName}], reason?, restrictedBy? }
router.post('/bulk', async (req, res) => {
  const { entityType, items = [], reason = '', restrictedBy = 'admin' } = req.body;
  if (!entityType || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, error: 'entityType and items[] are required' });
  }
  try {
    const ids   = items.map(i => i.entityId);
    const names = items.map(i => i.entityName ?? '');
    await pool.query(
      `INSERT INTO attendance_restrictions (entity_type, entity_id, entity_name, reason, restricted_by)
       SELECT $1, u.id, u.name, $4, $5
       FROM unnest($2::text[], $3::text[]) AS u(id, name)
       ON CONFLICT (entity_type, entity_id) DO UPDATE
         SET reason = EXCLUDED.reason, restricted_by = EXCLUDED.restricted_by,
             entity_name = EXCLUDED.entity_name, created_at = NOW()`,
      [entityType, ids, names, reason, restrictedBy]
    );
    res.json({ ok: true, count: items.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── DELETE /api/local/restrictions/bulk/:entityType ──────────────────────────
// Lift ALL restrictions for a given entity type.
// MUST be declared before /:entityType/:entityId to avoid route shadowing.
router.delete('/bulk/:entityType', async (req, res) => {
  const { entityType } = req.params;
  if (!['cell', 'dept'].includes(entityType)) {
    return res.status(400).json({ ok: false, error: 'entityType must be cell or dept' });
  }
  try {
    const r = await pool.query(
      `DELETE FROM attendance_restrictions WHERE entity_type = $1`,
      [entityType]
    );
    res.json({ ok: true, count: r.rowCount });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── DELETE /api/local/restrictions/:entityType/:entityId ────────────────────
router.delete('/:entityType/:entityId', async (req, res) => {
  const { entityType, entityId } = req.params;
  try {
    await pool.query(
      `DELETE FROM attendance_restrictions WHERE entity_type = $1 AND entity_id = $2`,
      [entityType, entityId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
