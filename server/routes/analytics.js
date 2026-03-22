import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ─── Simple TTL cache (5 minutes) ─────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) { cache.delete(key); return null; }
  return entry.value;
}

function cacheSet(key, value) {
  cache.set(key, { value, ts: Date.now() });
  return value;
}

async function cached(key, fn) {
  const hit = cacheGet(key);
  if (hit !== null) return hit;
  return cacheSet(key, await fn());
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateFrom(period) {
  const days = { 1: 7, 2: 30, 3: 365 }[parseInt(period)] ?? 7;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function getLabelExpr(period) {
  switch (parseInt(period)) {
    case 1: return `to_char(date_trunc('day', s."SundayService"), 'Dy DD')`;
    case 2: return `to_char(date_trunc('week', s."SundayService"), 'Mon DD')`;
    case 3: return `to_char(date_trunc('month', s."SundayService"), 'Mon YYYY')`;
    default: return `to_char(date_trunc('day', s."SundayService"), 'Dy DD')`;
  }
}

function getGroupExpr(period) {
  switch (parseInt(period)) {
    case 1: return `date_trunc('day', s."SundayService")`;
    case 2: return `date_trunc('week', s."SundayService")`;
    case 3: return `date_trunc('month', s."SundayService")`;
    default: return `date_trunc('day', s."SundayService")`;
  }
}

function wrapResult(data) {
  return { data, message: 'success', status: true };
}

function errResult(message) {
  return { data: null, message, status: false };
}

// ─── Core analytics query (cell-based: admin / zone / cell) ───────────────────

async function getCellAttendanceData(period, extraWhere = '', extraParams = []) {
  const dateFrom = getDateFrom(period);
  const labelExpr = getLabelExpr(period);
  const groupExpr = getGroupExpr(period);
  const params = [dateFrom, ...extraParams];

  const baseFrom = `
    FROM "CellAttendance" ca
    JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
    JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
    JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
    WHERE s."SundayService" >= $1 ${extraWhere}
  `;

  const perfQ = `
    SELECT
      ROUND(COUNT(CASE WHEN s."AttendanceStatus"  = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN s."AttendanceStatus"  NOT IN (0,6) THEN 1 END),0), 2) AS "sundayService",
      ROUND(COUNT(CASE WHEN t."AttendanceStatus"  = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN t."AttendanceStatus"  NOT IN (0,6) THEN 1 END),0), 2) AS "tuesdayAttendance",
      ROUND(COUNT(CASE WHEN cm."AttendanceStatus" = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN cm."AttendanceStatus" NOT IN (0,6) THEN 1 END),0), 2) AS "cellAttendance"
    ${baseFrom}
  `;

  const periodicQ = `
    SELECT
      ${labelExpr}  AS label,
      COUNT(CASE WHEN cm."AttendanceStatus" = 1 THEN 1 END)::int AS "cellCount",
      COUNT(CASE WHEN s."AttendanceStatus"  = 1 THEN 1 END)::int AS "sundayServiceCount",
      COUNT(CASE WHEN t."AttendanceStatus"  = 1 THEN 1 END)::int AS "tuesdayServiceCount"
    ${baseFrom}
    GROUP BY ${groupExpr}
    ORDER BY ${groupExpr}
  `;

  const [perfRes, periodicRes] = await Promise.all([
    pool.query(perfQ, params),
    pool.query(periodicQ, params)
  ]);

  return { perf: perfRes.rows[0], periodic: periodicRes.rows };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /analytics/admin?period=1
router.get('/analytics/admin', async (req, res) => {
  try {
    const { period = '1' } = req.query;
    const key = `admin:${period}`;

    const data = await cached(key, async () => {
      const { perf, periodic } = await getCellAttendanceData(period);
      const [memberRes, zoneRes] = await Promise.all([
        pool.query('SELECT COUNT(*) AS count FROM "Members"'),
        pool.query('SELECT COUNT(*) AS count FROM "Zones"')
      ]);
      return {
        performanceInPercentage: {
          cellStrength:      parseInt(memberRes.rows[0].count),
          sundayService:     parseFloat(perf?.sundayService     ?? 0),
          tuesdayAttendance: parseFloat(perf?.tuesdayAttendance ?? 0),
          cellAttendance:    parseFloat(perf?.cellAttendance    ?? 0)
        },
        periodicAnalysisDatapoint: periodic,
        cellCount: parseInt(zoneRes.rows[0].count)
      };
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[admin analytics]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// GET /analytics/zone/:id?period=1
router.get('/analytics/zone/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '1' } = req.query;
    const key = `zone:${id}:${period}`;

    const data = await cached(key, async () => {
      const { perf, periodic } = await getCellAttendanceData(period, 'AND ca."ZoneId" = $2', [id]);
      const [memberRes, cellRes] = await Promise.all([
        pool.query('SELECT COUNT(*) AS count FROM "Members" WHERE "ZoneId" = $1', [id]),
        pool.query('SELECT COUNT(*) AS count FROM "Cells"   WHERE "ZoneId" = $1', [id])
      ]);
      return {
        performanceInPercentage: {
          cellStrength:      parseInt(memberRes.rows[0].count),
          sundayService:     parseFloat(perf?.sundayService     ?? 0),
          tuesdayAttendance: parseFloat(perf?.tuesdayAttendance ?? 0),
          cellAttendance:    parseFloat(perf?.cellAttendance    ?? 0)
        },
        periodicAnalysisDatapoint: periodic,
        cellCount: parseInt(cellRes.rows[0].count)
      };
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[zone analytics]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// GET /analytics/cell/:id?period=1
router.get('/analytics/cell/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '1' } = req.query;
    const key = `cell:${id}:${period}`;

    const data = await cached(key, async () => {
      const { perf, periodic } = await getCellAttendanceData(period, 'AND ca."CellId" = $2', [id]);
      const memberRes = await pool.query(
        'SELECT COUNT(*) AS count FROM "Members" WHERE "CellId" = $1', [id]
      );
      return {
        performanceInPercentage: {
          cellStrength:      parseInt(memberRes.rows[0].count),
          sundayService:     parseFloat(perf?.sundayService     ?? 0),
          tuesdayAttendance: parseFloat(perf?.tuesdayAttendance ?? 0),
          cellAttendance:    parseFloat(perf?.cellAttendance    ?? 0)
        },
        periodicAnalysisDatapoint: periodic
      };
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[cell analytics]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// GET /analytics/service-summary?Period=1&RolesUnitAccessType=4&Id=xxx
router.get('/analytics/service-summary', async (req, res) => {
  try {
    const { Period = '1', RolesUnitAccessType = '0', Id } = req.query;
    const key = `service-summary:${Period}:${RolesUnitAccessType}:${Id ?? 'all'}`;

    const data = await cached(key, async () => {
      const dateFrom = getDateFrom(Period);
      const roleType = parseInt(RolesUnitAccessType);
      const isDept = roleType === 8 || roleType === 9;

      let params = [dateFrom];
      let whereExtra = '';

      if (isDept && Id) {
        whereExtra = `AND da."DepartmentalLeaderId" = (SELECT "DepartmentLeaderId" FROM "Departments" WHERE "Id" = $2)`;
        params.push(Id);
      } else if (roleType === 4 && Id) {
        whereExtra = 'AND ca."ZoneId" = $2'; params.push(Id);
      } else if ((roleType === 5 || roleType === 6) && Id) {
        whereExtra = 'AND ca."CellId" = $2'; params.push(Id);
      }

      const query = isDept ? `
        SELECT
          COUNT(DISTINCT da."Id")::int AS total,
          COUNT(DISTINCT CASE WHEN s."AttendanceStatus" = 1 THEN da."Id" END)::int AS "totalSunday",
          COUNT(DISTINCT CASE WHEN t."AttendanceStatus" = 1 THEN da."Id" END)::int AS "totalTuesday",
          0::int AS "totalCellAttendees",
          ROUND(COUNT(DISTINCT CASE WHEN s."AttendanceStatus" = 1 THEN da."Id" END)*100.0/NULLIF(COUNT(DISTINCT CASE WHEN s."AttendanceStatus" NOT IN (0,6) THEN da."Id" END),0),2) AS "totalSundayPercentage",
          ROUND(COUNT(DISTINCT CASE WHEN t."AttendanceStatus" = 1 THEN da."Id" END)*100.0/NULLIF(COUNT(DISTINCT CASE WHEN t."AttendanceStatus" NOT IN (0,6) THEN da."Id" END),0),2) AS "totalTuesdayPercentage",
          0::numeric AS "totalCellAttendeesPercentage",
          ROUND((COUNT(DISTINCT CASE WHEN s."AttendanceStatus"=1 THEN da."Id" END)+COUNT(DISTINCT CASE WHEN t."AttendanceStatus"=1 THEN da."Id" END))*100.0/NULLIF(COUNT(DISTINCT CASE WHEN s."AttendanceStatus" NOT IN (0,6) THEN da."Id" END)+COUNT(DISTINCT CASE WHEN t."AttendanceStatus" NOT IN (0,6) THEN da."Id" END),0),2) AS "totalPercentage"
        FROM "DepartmentAttendances" da
        JOIN "Sunday"  s ON da."SundayServiceId"  = s."Id"
        JOIN "Tuesday" t ON da."TuesdayServiceId" = t."Id"
        WHERE s."SundayService" >= $1 ${whereExtra}
      ` : `
        SELECT
          COUNT(*)::int AS total,
          COUNT(CASE WHEN s."AttendanceStatus"  = 1 THEN 1 END)::int AS "totalSunday",
          COUNT(CASE WHEN t."AttendanceStatus"  = 1 THEN 1 END)::int AS "totalTuesday",
          COUNT(CASE WHEN cm."AttendanceStatus" = 1 THEN 1 END)::int AS "totalCellAttendees",
          ROUND(COUNT(CASE WHEN s."AttendanceStatus"  = 1 THEN 1 END)*100.0/NULLIF(COUNT(CASE WHEN s."AttendanceStatus"  NOT IN (0,6) THEN 1 END),0),2) AS "totalSundayPercentage",
          ROUND(COUNT(CASE WHEN t."AttendanceStatus"  = 1 THEN 1 END)*100.0/NULLIF(COUNT(CASE WHEN t."AttendanceStatus"  NOT IN (0,6) THEN 1 END),0),2) AS "totalTuesdayPercentage",
          ROUND(COUNT(CASE WHEN cm."AttendanceStatus" = 1 THEN 1 END)*100.0/NULLIF(COUNT(CASE WHEN cm."AttendanceStatus" NOT IN (0,6) THEN 1 END),0),2) AS "totalCellAttendeesPercentage",
          ROUND((COUNT(CASE WHEN s."AttendanceStatus"=1 THEN 1 END)+COUNT(CASE WHEN t."AttendanceStatus"=1 THEN 1 END)+COUNT(CASE WHEN cm."AttendanceStatus"=1 THEN 1 END))*100.0/NULLIF(COUNT(CASE WHEN s."AttendanceStatus" NOT IN (0,6) THEN 1 END)+COUNT(CASE WHEN t."AttendanceStatus" NOT IN (0,6) THEN 1 END)+COUNT(CASE WHEN cm."AttendanceStatus" NOT IN (0,6) THEN 1 END),0),2) AS "totalPercentage"
        FROM "CellAttendance" ca
        JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
        WHERE s."SundayService" >= $1 ${whereExtra}
      `;

      const result = await pool.query(query, params);
      const row = result.rows[0];
      return {
        total:                        row.total,
        totalSunday:                  row.totalSunday,
        totalTuesday:                 row.totalTuesday,
        totalCellAttendees:           row.totalCellAttendees,
        totalSundayPercentage:        parseFloat(row.totalSundayPercentage        ?? 0),
        totalTuesdayPercentage:       parseFloat(row.totalTuesdayPercentage       ?? 0),
        totalCellAttendeesPercentage: parseFloat(row.totalCellAttendeesPercentage ?? 0),
        totalPercentage:              parseFloat(row.totalPercentage               ?? 0)
      };
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[service summary]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// GET /analytics/status-summary?Period=1&RolesUnitAccessType=4&Id=xxx
router.get('/analytics/status-summary', async (req, res) => {
  try {
    const { Period = '1', RolesUnitAccessType = '0', Id } = req.query;
    const key = `status-summary:${Period}:${RolesUnitAccessType}:${Id ?? 'all'}`;

    const data = await cached(key, async () => {
      const dateFrom = getDateFrom(Period);
      const roleType = parseInt(RolesUnitAccessType);
      const isDept = roleType === 8 || roleType === 9;

      let params = [dateFrom];
      let table = '"CellAttendance" ca';
      let joinSunday = 'JOIN "Sunday" s ON ca."SundayServiceId" = s."Id"';
      let whereExtra = '';

      if (isDept && Id) {
        table = '"DepartmentAttendances" da';
        joinSunday = 'JOIN "Sunday" s ON da."SundayServiceId" = s."Id"';
        whereExtra = `AND da."DepartmentalLeaderId" = (SELECT "DepartmentLeaderId" FROM "Departments" WHERE "Id" = $2)`;
        params.push(Id);
      } else if (roleType === 4 && Id) {
        whereExtra = 'AND ca."ZoneId" = $2'; params.push(Id);
      } else if ((roleType === 5 || roleType === 6) && Id) {
        whereExtra = 'AND ca."CellId" = $2'; params.push(Id);
      }

      const query = `
        SELECT
          COUNT(*)::int                                              AS total,
          COUNT(CASE WHEN s."AttendanceStatus" = 1 THEN 1 END)::int AS "totalPresent",
          COUNT(CASE WHEN s."AttendanceStatus" = 2 THEN 1 END)::int AS "totalAbsent",
          COUNT(CASE WHEN s."AttendanceStatus" = 3 THEN 1 END)::int AS "totalSick",
          COUNT(CASE WHEN s."AttendanceStatus" = 4 THEN 1 END)::int AS "totalTravel",
          COUNT(CASE WHEN s."AttendanceStatus" = 5 THEN 1 END)::int AS "totalNCM"
        FROM ${table}
        ${joinSunday}
        WHERE s."SundayService" >= $1 ${whereExtra}
      `;

      const result = await pool.query(query, params);
      return result.rows[0];
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[status summary]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// GET /analytics/leader-context?email=xxx
router.get('/analytics/leader-context', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json(errResult('email required'));

    const userRes = await pool.query(
      `SELECT "Id", "CellId", "ZoneId" FROM "AspNetUsers" WHERE "NormalizedEmail" = $1 LIMIT 1`,
      [email.toString().toUpperCase()]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json(errResult('User not found'));
    }

    const user = userRes.rows[0];
    let { CellId: cellId, ZoneId: zonalId } = user;

    if (!cellId) {
      const clRes = await pool.query(
        `SELECT "CellId" FROM "CellLeaders" WHERE "UserId" = $1 AND "IsAssistant" = false LIMIT 1`,
        [user.Id]
      );
      if (clRes.rows.length > 0) cellId = clRes.rows[0].CellId;
    }

    if (!zonalId) {
      const zlRes = await pool.query(
        `SELECT "ZoneId" FROM "ZonalLeaders" WHERE "UserId" = $1 LIMIT 1`,
        [user.Id]
      );
      if (zlRes.rows.length > 0) zonalId = zlRes.rows[0].ZoneId;
    }

    res.json(wrapResult({ cellId: cellId ?? null, zonalId: zonalId ?? null, userId: user.Id }));
  } catch (err) {
    console.error('[leader context]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// ─── NEW: Admin Dept Attendance Summary ───────────────────────────────────────
// GET /analytics/admin/dept-attendance?period=1&StartAt=&EndAt=
// Returns all departments with their attendance summary grouped by period.
// Attendance records are linked via DepartmentalLeaderId → Departments.DepartmentLeaderId.
router.get('/analytics/admin/dept-attendance', async (req, res) => {
  try {
    const { period = '2', StartAt, EndAt } = req.query;
    const key = `admin-dept-attendance:${period}:${StartAt ?? ''}:${EndAt ?? ''}`;

    const data = await cached(key, async () => {
      const labelExpr = getLabelExpr(period);
      const groupExpr = getGroupExpr(period);

      let dateFrom = getDateFrom(period);
      let dateTo = new Date();
      if (StartAt) dateFrom = new Date(StartAt);
      if (EndAt) dateTo = new Date(EndAt);

      // Fetch all departments with their leaders
      const deptsRes = await pool.query(`
        SELECT
          d."Id"   AS dept_id,
          d."Name" AS dept_name,
          d."IsActive",
          u."Id"          AS leader_id,
          u."FirstName" || ' ' || u."LastName" AS leader_name,
          u."Email"        AS leader_email,
          u."PhoneNumber"  AS leader_phone,
          u."UpdatedAt"    AS leader_last_login
        FROM "Departments" d
        LEFT JOIN "AspNetUsers" u ON u."Id" = d."DepartmentLeaderId"
        ORDER BY d."Name"
      `);

      // Fetch attendance grouped by DepartmentalLeaderId + period label
      const attRes = await pool.query(`
        SELECT
          da."DepartmentalLeaderId" AS leader_id,
          ${labelExpr}              AS period_label,
          ${groupExpr}              AS period_sort,
          COUNT(*)::int                                                    AS total,
          COUNT(CASE WHEN s."AttendanceStatus" = 1 THEN 1 END)::int       AS sunday_present,
          COUNT(CASE WHEN s."AttendanceStatus" = 2 THEN 1 END)::int       AS sunday_absent,
          COUNT(CASE WHEN t."AttendanceStatus" = 1 THEN 1 END)::int       AS tuesday_present,
          COUNT(CASE WHEN t."AttendanceStatus" = 2 THEN 1 END)::int       AS tuesday_absent,
          ROUND(COUNT(CASE WHEN s."AttendanceStatus"=1 THEN 1 END)*100.0/NULLIF(COUNT(CASE WHEN s."AttendanceStatus" NOT IN (0,6) THEN 1 END),0),2) AS sunday_pct,
          ROUND(COUNT(CASE WHEN t."AttendanceStatus"=1 THEN 1 END)*100.0/NULLIF(COUNT(CASE WHEN t."AttendanceStatus" NOT IN (0,6) THEN 1 END),0),2) AS tuesday_pct
        FROM "DepartmentAttendances" da
        JOIN "Sunday"  s ON da."SundayServiceId"  = s."Id"
        JOIN "Tuesday" t ON da."TuesdayServiceId" = t."Id"
        WHERE s."SundayService" >= $1 AND s."SundayService" <= $2
        GROUP BY da."DepartmentalLeaderId", ${labelExpr}, ${groupExpr}
        ORDER BY ${groupExpr} ASC
      `, [dateFrom, dateTo]);

      // Fetch overall totals per leader
      const totalsRes = await pool.query(`
        SELECT
          da."DepartmentalLeaderId" AS leader_id,
          COUNT(*)::int AS total,
          ROUND(COUNT(CASE WHEN s."AttendanceStatus"=1 THEN 1 END)*100.0/NULLIF(COUNT(CASE WHEN s."AttendanceStatus" NOT IN (0,6) THEN 1 END),0),2) AS sunday_pct,
          ROUND(COUNT(CASE WHEN t."AttendanceStatus"=1 THEN 1 END)*100.0/NULLIF(COUNT(CASE WHEN t."AttendanceStatus" NOT IN (0,6) THEN 1 END),0),2) AS tuesday_pct,
          ROUND((COUNT(CASE WHEN s."AttendanceStatus"=1 THEN 1 END)+COUNT(CASE WHEN t."AttendanceStatus"=1 THEN 1 END))*100.0/NULLIF(COUNT(CASE WHEN s."AttendanceStatus" NOT IN (0,6) THEN 1 END)+COUNT(CASE WHEN t."AttendanceStatus" NOT IN (0,6) THEN 1 END),0),2) AS overall_pct
        FROM "DepartmentAttendances" da
        JOIN "Sunday"  s ON da."SundayServiceId"  = s."Id"
        JOIN "Tuesday" t ON da."TuesdayServiceId" = t."Id"
        WHERE s."SundayService" >= $1 AND s."SundayService" <= $2
        GROUP BY da."DepartmentalLeaderId"
      `, [dateFrom, dateTo]);

      // Build lookup maps
      const periodByLeader = {};
      for (const row of attRes.rows) {
        if (!periodByLeader[row.leader_id]) periodByLeader[row.leader_id] = [];
        periodByLeader[row.leader_id].push({
          label:          row.period_label,
          total:          row.total,
          sundayPresent:  row.sunday_present,
          sundayAbsent:   row.sunday_absent,
          tuesdayPresent: row.tuesday_present,
          tuesdayAbsent:  row.tuesday_absent,
          sundayPct:      parseFloat(row.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(row.tuesday_pct ?? 0)
        });
      }

      const totalsByLeader = {};
      for (const row of totalsRes.rows) {
        totalsByLeader[row.leader_id] = {
          total:      row.total,
          sundayPct:  parseFloat(row.sunday_pct  ?? 0),
          tuesdayPct: parseFloat(row.tuesday_pct ?? 0),
          overallPct: parseFloat(row.overall_pct ?? 0)
        };
      }

      // Merge departments with attendance
      return deptsRes.rows.map(dept => ({
        departmentId:  dept.dept_id,
        name:          dept.dept_name,
        isActive:      dept.IsActive,
        leader: dept.leader_id ? {
          id:        dept.leader_id,
          name:      dept.leader_name,
          email:     dept.leader_email,
          phone:     dept.leader_phone,
          lastLogin: dept.leader_last_login
        } : null,
        summary: totalsByLeader[dept.leader_id] ?? { total: 0, sundayPct: 0, tuesdayPct: 0, overallPct: 0 },
        periodData: periodByLeader[dept.leader_id] ?? []
      }));
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[admin dept-attendance]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// ─── NEW: Admin Zones Overview ─────────────────────────────────────────────────
// GET /analytics/admin/zones-overview?period=1
// All zones with cells, leaders (incl. last login), member counts, and KPI performance.
router.get('/analytics/admin/zones-overview', async (req, res) => {
  try {
    const { period = '2' } = req.query;
    const key = `admin-zones-overview:${period}`;

    const data = await cached(key, async () => {
      const dateFrom = getDateFrom(period);

      // All zones with zonal leaders
      const zonesRes = await pool.query(`
        SELECT
          z."Id"       AS zone_id,
          z."Name"     AS zone_name,
          z."ZoneStatus",
          u."Id"       AS leader_id,
          u."FirstName" || ' ' || u."LastName" AS leader_name,
          u."Email"    AS leader_email,
          u."PhoneNumber" AS leader_phone,
          u."UpdatedAt"   AS leader_last_login,
          COUNT(DISTINCT c."Id")::int AS cell_count,
          COUNT(DISTINCT m."Id")::int AS member_count
        FROM "Zones" z
        LEFT JOIN "ZonalLeaders" zl ON zl."ZoneId" = z."Id"
        LEFT JOIN "AspNetUsers" u  ON u."Id" = zl."UserId"
        LEFT JOIN "Cells" c        ON c."ZoneId" = z."Id"
        LEFT JOIN "Members" m      ON m."ZoneId" = z."Id"
        GROUP BY z."Id", z."Name", z."ZoneStatus",
                 u."Id", u."FirstName", u."LastName", u."Email", u."PhoneNumber", u."UpdatedAt"
        ORDER BY z."Name"
      `);

      // All cells with their leaders
      const cellsRes = await pool.query(`
        SELECT
          c."Id"     AS cell_id,
          c."Name"   AS cell_name,
          c."ZoneId" AS zone_id,
          c."CellStatus",
          u."Id"     AS leader_id,
          u."FirstName" || ' ' || u."LastName" AS leader_name,
          u."Email"  AS leader_email,
          u."PhoneNumber" AS leader_phone,
          u."UpdatedAt"   AS leader_last_login,
          cl."IsAssistant",
          COUNT(DISTINCT m."Id")::int AS member_count
        FROM "Cells" c
        LEFT JOIN "CellLeaders" cl ON cl."CellId" = c."Id" AND cl."IsAssistant" = false
        LEFT JOIN "AspNetUsers" u  ON u."Id" = cl."UserId"
        LEFT JOIN "Members" m      ON m."CellId" = c."Id"
        GROUP BY c."Id", c."Name", c."ZoneId", c."CellStatus",
                 u."Id", u."FirstName", u."LastName", u."Email", u."PhoneNumber", u."UpdatedAt", cl."IsAssistant"
        ORDER BY c."Name"
      `);

      // How many distinct Sundays exist in the period → denominator base
      const wkRes = await pool.query(
        `SELECT COUNT(DISTINCT "SundayService")::int AS wk FROM "Sunday" WHERE "SundayService" >= $1`,
        [dateFrom]
      );
      const weekCount = wkRes.rows[0]?.wk ?? 1;

      // Zone-level performance — present counts only; % computed in JS using member_count × weekCount
      const zonePerfRes = await pool.query(`
        SELECT
          ca."ZoneId"                                                          AS zone_id,
          COUNT(*)                                                    ::int    AS total_records,
          COUNT(CASE WHEN s."AttendanceStatus"  = 1 THEN 1 END)      ::int    AS sunday_present,
          COUNT(CASE WHEN t."AttendanceStatus"  = 1 THEN 1 END)      ::int    AS tuesday_present,
          COUNT(CASE WHEN cm."AttendanceStatus" = 1 THEN 1 END)      ::int    AS cell_present
        FROM "CellAttendance" ca
        JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
        WHERE s."SundayService" >= $1
        GROUP BY ca."ZoneId"
      `, [dateFrom]);

      // Cell-level performance — same approach
      const cellPerfRes = await pool.query(`
        SELECT
          ca."CellId"                                                          AS cell_id,
          COUNT(*)                                                    ::int    AS total_records,
          COUNT(CASE WHEN s."AttendanceStatus"  = 1 THEN 1 END)      ::int    AS sunday_present,
          COUNT(CASE WHEN t."AttendanceStatus"  = 1 THEN 1 END)      ::int    AS tuesday_present,
          COUNT(CASE WHEN cm."AttendanceStatus" = 1 THEN 1 END)      ::int    AS cell_present
        FROM "CellAttendance" ca
        JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
        WHERE s."SundayService" >= $1
        GROUP BY ca."CellId"
      `, [dateFrom]);

      // Helper: compute pct using expected = members × weekCount as denominator
      const pctOf = (present, memberCount) => {
        const expected = memberCount * weekCount;
        return expected === 0 ? 0 : Math.round(present * 1000 / expected) / 10;
      };

      // Build lookup maps (present counts keyed by id)
      const zonePerfRaw = {};
      for (const r of zonePerfRes.rows) {
        zonePerfRaw[r.zone_id] = {
          totalRecords:    r.total_records,
          sundayPresent:   r.sunday_present,
          tuesdayPresent:  r.tuesday_present,
          cellPresent:     r.cell_present
        };
      }

      const cellPerfRaw = {};
      for (const r of cellPerfRes.rows) {
        cellPerfRaw[r.cell_id] = {
          totalRecords:    r.total_records,
          sundayPresent:   r.sunday_present,
          tuesdayPresent:  r.tuesday_present,
          cellPresent:     r.cell_present
        };
      }

      // Group cells by zone — % computed from member_count × weekCount
      const cellsByZone = {};
      for (const c of cellsRes.rows) {
        if (!cellsByZone[c.zone_id]) cellsByZone[c.zone_id] = [];
        const cp  = cellPerfRaw[c.cell_id];
        const exp = c.member_count * weekCount;
        cellsByZone[c.zone_id].push({
          cellId:      c.cell_id,
          name:        c.cell_name,
          cellStatus:  c.CellStatus,
          memberCount: c.member_count,
          leader: c.leader_id ? {
            id:        c.leader_id,
            name:      c.leader_name,
            email:     c.leader_email,
            phone:     c.leader_phone,
            lastLogin: c.leader_last_login
          } : null,
          performance: cp
            ? {
                totalRecords:  cp.totalRecords,
                expected:      exp,
                weekCount,
                sundayPresent: cp.sundayPresent,
                tuesdayPresent: cp.tuesdayPresent,
                cellPresent:   cp.cellPresent,
                sundayPct:     pctOf(cp.sundayPresent,  c.member_count),
                tuesdayPct:    pctOf(cp.tuesdayPresent, c.member_count),
                cellPct:       pctOf(cp.cellPresent,    c.member_count)
              }
            : { totalRecords: 0, expected: exp, weekCount, sundayPresent: 0, tuesdayPresent: 0, cellPresent: 0, sundayPct: 0, tuesdayPct: 0, cellPct: 0 }
        });
      }

      // Build final zones array — % computed from zone member_count × weekCount
      return zonesRes.rows.map(z => {
        const zp  = zonePerfRaw[z.zone_id];
        const exp = z.member_count * weekCount;
        return {
          zoneId:      z.zone_id,
          name:        z.zone_name,
          zoneStatus:  z.ZoneStatus,
          cellCount:   z.cell_count,
          memberCount: z.member_count,
          weekCount,
          leader: z.leader_id ? {
            id:        z.leader_id,
            name:      z.leader_name,
            email:     z.leader_email,
            phone:     z.leader_phone,
            lastLogin: z.leader_last_login
          } : null,
          performance: zp
            ? {
                totalRecords:   zp.totalRecords,
                expected:       exp,
                weekCount,
                sundayPresent:  zp.sundayPresent,
                tuesdayPresent: zp.tuesdayPresent,
                cellPresent:    zp.cellPresent,
                sundayPct:      pctOf(zp.sundayPresent,  z.member_count),
                tuesdayPct:     pctOf(zp.tuesdayPresent, z.member_count),
                cellPct:        pctOf(zp.cellPresent,    z.member_count)
              }
            : { totalRecords: 0, expected: exp, weekCount, sundayPresent: 0, tuesdayPresent: 0, cellPresent: 0, sundayPct: 0, tuesdayPct: 0, cellPct: 0 },
          cells: cellsByZone[z.zone_id] ?? []
        };
      });
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[admin zones-overview]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// ─── NEW: Admin Dept Overview ──────────────────────────────────────────────────
// GET /analytics/admin/dept-overview?period=1
// All departments with leader (incl. last login), member counts, and KPI performance.
router.get('/analytics/admin/dept-overview', async (req, res) => {
  try {
    const { period = '2' } = req.query;
    const key = `admin-dept-overview:${period}`;

    const data = await cached(key, async () => {
      const dateFrom = getDateFrom(period);

      // All departments with leaders
      const deptsRes = await pool.query(`
        SELECT
          d."Id"     AS dept_id,
          d."Name"   AS dept_name,
          d."IsActive",
          d."AssistDepartmentLeaderIds",
          u."Id"     AS leader_id,
          u."FirstName" || ' ' || u."LastName" AS leader_name,
          u."Email"  AS leader_email,
          u."PhoneNumber" AS leader_phone,
          u."UpdatedAt"   AS leader_last_login
        FROM "Departments" d
        LEFT JOIN "AspNetUsers" u ON u."Id" = d."DepartmentLeaderId"
        ORDER BY d."Name"
      `);

      // Distinct Sunday weeks in the period — denominator base for dept
      const wkRes2 = await pool.query(
        `SELECT COUNT(DISTINCT "SundayService")::int AS wk FROM "Sunday" WHERE "SundayService" >= $1`,
        [dateFrom]
      );
      const weekCount2 = wkRes2.rows[0]?.wk ?? 1;

      // Dept performance — denominator = max_weekly (largest filing in any single week) × weekCount
      // max_weekly ≈ dept member count; penalises leaders who file less than every week.
      const deptPerfRes = await pool.query(`
        SELECT
          da."DepartmentalLeaderId"                                                           AS leader_id,
          COUNT(*)                                                                  ::int     AS total_records,
          COUNT(CASE WHEN s."AttendanceStatus"=1 THEN 1 END)                        ::int     AS sunday_present,
          COUNT(CASE WHEN t."AttendanceStatus"=1 THEN 1 END)                        ::int     AS tuesday_present,
          (
            SELECT COALESCE(MAX(wkc), 0)::int
            FROM (
              SELECT COUNT(*)::int AS wkc
              FROM "DepartmentAttendances" da2
              JOIN "Sunday" s2 ON da2."SundayServiceId" = s2."Id"
              WHERE da2."DepartmentalLeaderId" = da."DepartmentalLeaderId"
                AND s2."SundayService" >= $1
              GROUP BY da2."SundayServiceId"
            ) weekly_counts
          )                                                                          ::int     AS max_weekly
        FROM "DepartmentAttendances" da
        JOIN "Sunday"  s ON da."SundayServiceId"  = s."Id"
        JOIN "Tuesday" t ON da."TuesdayServiceId" = t."Id"
        WHERE s."SundayService" >= $1
        GROUP BY da."DepartmentalLeaderId"
      `, [dateFrom]);

      const pctOfDept = (present, maxWeekly) => {
        const expected = maxWeekly * weekCount2;
        return expected === 0 ? 0 : Math.round(present * 1000 / expected) / 10;
      };

      const perfByLeader = {};
      for (const r of deptPerfRes.rows) {
        const expected = r.max_weekly * weekCount2;
        perfByLeader[r.leader_id] = {
          totalRecords:   r.total_records,
          expected,
          maxWeekly:      r.max_weekly,
          weekCount:      weekCount2,
          sundayPresent:  r.sunday_present,
          tuesdayPresent: r.tuesday_present,
          sundayPct:      pctOfDept(r.sunday_present,  r.max_weekly),
          tuesdayPct:     pctOfDept(r.tuesday_present, r.max_weekly),
          overallPct:     expected === 0 ? 0 : Math.round((r.sunday_present + r.tuesday_present) * 1000 / (2 * expected)) / 10
        };
      }

      // Get assistant leaders for all departments
      const allAssistIds = [];
      const deptAssistMap = {};
      for (const d of deptsRes.rows) {
        if (d.AssistDepartmentLeaderIds) {
          const ids = d.AssistDepartmentLeaderIds.split(',').map(s => s.trim()).filter(Boolean);
          deptAssistMap[d.dept_id] = ids;
          allAssistIds.push(...ids);
        }
      }

      let assistMap = {};
      if (allAssistIds.length > 0) {
        const placeholders = allAssistIds.map((_, i) => `$${i + 1}`).join(',');
        const assistRes = await pool.query(
          `SELECT "Id", "FirstName" || ' ' || "LastName" AS name, "Email", "PhoneNumber", "UpdatedAt"
           FROM "AspNetUsers" WHERE "Id"::text IN (${placeholders})`,
          allAssistIds
        );
        for (const u of assistRes.rows) {
          assistMap[u.Id] = { id: u.Id, name: u.name, email: u.Email, phone: u.PhoneNumber, lastLogin: u.UpdatedAt };
        }
      }

      return deptsRes.rows.map(d => ({
        departmentId: d.dept_id,
        name:         d.dept_name,
        isActive:     d.IsActive,
        leader: d.leader_id ? {
          id:        d.leader_id,
          name:      d.leader_name,
          email:     d.leader_email,
          phone:     d.leader_phone,
          lastLogin: d.leader_last_login
        } : null,
        assistants: (deptAssistMap[d.dept_id] ?? []).map(id => assistMap[id]).filter(Boolean),
        performance: perfByLeader[d.leader_id] ?? { totalRecords: 0, expected: 0, maxWeekly: 0, weekCount: weekCount2, sundayPresent: 0, tuesdayPresent: 0, sundayPct: 0, tuesdayPct: 0, overallPct: 0 }
      }));
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[admin dept-overview]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// ─── NEW: Admin Leaders Overview ───────────────────────────────────────────────
// GET /analytics/admin/leaders
// All leaders (zonal, cell, dept + assistants) with last login and performance.
router.get('/analytics/admin/leaders', async (req, res) => {
  try {
    const { period = '2' } = req.query;
    const key = `admin-leaders:${period}`;

    const data = await cached(key, async () => {
      const dateFrom = getDateFrom(period);

      // Zonal leaders
      const zonalRes = await pool.query(`
        SELECT
          u."Id",
          u."FirstName" || ' ' || u."LastName" AS name,
          u."Email", u."PhoneNumber", u."UpdatedAt" AS last_login,
          z."Id" AS zone_id, z."Name" AS zone_name,
          COUNT(DISTINCT c."Id")::int AS cell_count,
          COUNT(DISTINCT m."Id")::int AS member_count
        FROM "ZonalLeaders" zl
        JOIN "AspNetUsers" u ON u."Id" = zl."UserId"
        JOIN "Zones" z       ON z."Id" = zl."ZoneId"
        LEFT JOIN "Cells" c  ON c."ZoneId" = z."Id"
        LEFT JOIN "Members" m ON m."ZoneId" = z."Id"
        GROUP BY u."Id", u."FirstName", u."LastName", u."Email", u."PhoneNumber", u."UpdatedAt",
                 z."Id", z."Name"
        ORDER BY u."UpdatedAt" DESC NULLS LAST
      `);

      // Cell leaders (incl. assistants)
      // Role is authoritative from RolesUnitAccessType: 5 = CellLeader, 6 = AssistantCellLeader
      const cellRes = await pool.query(`
        SELECT
          u."Id",
          u."FirstName" || ' ' || u."LastName" AS name,
          u."Email", u."PhoneNumber", u."UpdatedAt" AS last_login,
          c."Id" AS cell_id, c."Name" AS cell_name,
          z."Id" AS zone_id, z."Name" AS zone_name,
          (u."RolesUnitAccessType"::int = 6) AS "IsAssistant",
          COUNT(DISTINCT m."Id")::int AS member_count
        FROM "CellLeaders" cl
        JOIN "AspNetUsers" u ON u."Id" = cl."UserId"
        JOIN "Cells" c       ON c."Id" = cl."CellId"
        JOIN "Zones" z       ON z."Id" = c."ZoneId"
        LEFT JOIN "Members" m ON m."CellId" = c."Id"
        GROUP BY u."Id", u."FirstName", u."LastName", u."Email", u."PhoneNumber", u."UpdatedAt",
                 u."RolesUnitAccessType", c."Id", c."Name", z."Id", z."Name"
        ORDER BY (u."RolesUnitAccessType"::int = 6) ASC, u."UpdatedAt" DESC NULLS LAST
      `);

      // Dept leaders + assistants
      const deptsRes = await pool.query(`
        SELECT d."Id" AS dept_id, d."Name" AS dept_name, d."AssistDepartmentLeaderIds",
               u."Id" AS leader_id, u."FirstName" || ' ' || u."LastName" AS leader_name,
               u."Email", u."PhoneNumber", u."UpdatedAt"
        FROM "Departments" d
        LEFT JOIN "AspNetUsers" u ON u."Id" = d."DepartmentLeaderId"
        ORDER BY d."Name"
      `);

      const allAssistIds = [];
      const deptForAssist = {};
      for (const d of deptsRes.rows) {
        if (d.AssistDepartmentLeaderIds) {
          const ids = d.AssistDepartmentLeaderIds.split(',').map(s => s.trim()).filter(Boolean);
          for (const id of ids) { deptForAssist[id] = { dept_id: d.dept_id, dept_name: d.dept_name }; allAssistIds.push(id); }
        }
      }

      let assistLeaders = [];
      if (allAssistIds.length > 0) {
        const ph = allAssistIds.map((_, i) => `$${i + 1}`).join(',');
        const aRes = await pool.query(
          `SELECT "Id", "FirstName" || ' ' || "LastName" AS name, "Email", "PhoneNumber", "UpdatedAt" FROM "AspNetUsers" WHERE "Id"::text IN (${ph})`,
          allAssistIds
        );
        assistLeaders = aRes.rows.map(u => ({
          id: u.Id, name: u.name, email: u.Email, phone: u.PhoneNumber, lastLogin: u.UpdatedAt,
          department: deptForAssist[u.Id]?.dept_name ?? '',
          departmentId: deptForAssist[u.Id]?.dept_id ?? '',
          isAssistant: true
        }));
      }

      // Period week count for dept denominator
      const deptWkRes = await pool.query(
        `SELECT COUNT(DISTINCT "SundayService")::int AS wk FROM "Sunday" WHERE "SundayService" >= $1`,
        [dateFrom]
      );
      const deptWeekCount = deptWkRes.rows[0]?.wk ?? 1;

      // Dept perf per leader — denominator = max_weekly × weekCount (penalises non-filers)
      const deptPerfRes = await pool.query(`
        SELECT
          da."DepartmentalLeaderId"                                                           AS user_id,
          COUNT(*)                                                                  ::int     AS total,
          COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1)                        ::int     AS sunday_present,
          COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1)                        ::int     AS tuesday_present,
          COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)                        ::int     AS cell_present,
          (
            SELECT COALESCE(MAX(wkc), 0)::int
            FROM (
              SELECT COUNT(*)::int AS wkc
              FROM "DepartmentAttendances" da2
              JOIN "Sunday" s2 ON da2."SundayServiceId" = s2."Id"
              WHERE da2."DepartmentalLeaderId" = da."DepartmentalLeaderId"
                AND s2."SundayService" >= $1
              GROUP BY da2."SundayServiceId"
            ) wk_inner
          )                                                                         ::int     AS max_weekly
        FROM "DepartmentAttendances" da
        JOIN "Sunday"      s  ON da."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON da."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON da."CellMeetingId"    = cm."Id"
        WHERE s."SundayService" >= $1
        GROUP BY da."DepartmentalLeaderId"
      `, [dateFrom]);

      const deptPerfMap = {};
      for (const r of deptPerfRes.rows) {
        const expected = r.max_weekly * deptWeekCount;
        const dPct = (present) => expected === 0 ? 0 : Math.round(present * 1000 / expected) / 10;
        deptPerfMap[r.user_id] = {
          total:          r.total,
          expected,
          maxWeekly:      r.max_weekly,
          weekCount:      deptWeekCount,
          sundayPresent:  r.sunday_present,
          tuesdayPresent: r.tuesday_present,
          cellPresent:    r.cell_present,
          sundayPct:      dPct(r.sunday_present),
          tuesdayPct:     dPct(r.tuesday_present),
          cellPct:        dPct(r.cell_present)
        };
      }

      // Cell perf per leader — denominator = member_count × week_count_in_period
      // This penalises leaders who skip filings: unfiled weeks count as 0 present.
      const cellPerfRes = await pool.query(`
        SELECT
          cl."UserId"                                                                          AS user_id,
          COUNT(*)                                                                   ::int     AS total,
          COALESCE(mc.member_count, 0)                                               ::int     AS member_count,
          pd.wk                                                                      ::int     AS week_count,
          (COALESCE(mc.member_count, 0) * pd.wk)                                    ::int     AS expected,
          COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1)                         ::int     AS sunday_present,
          COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1)                         ::int     AS tuesday_present,
          COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)                         ::int     AS cell_present,
          ROUND(COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1) * 100.0 / NULLIF(COALESCE(mc.member_count, 0) * pd.wk, 0), 2) AS sunday_pct,
          ROUND(COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1) * 100.0 / NULLIF(COALESCE(mc.member_count, 0) * pd.wk, 0), 2) AS tuesday_pct,
          ROUND(COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1) * 100.0 / NULLIF(COALESCE(mc.member_count, 0) * pd.wk, 0), 2) AS cell_pct
        FROM "CellLeaders" cl
        JOIN "CellAttendance" ca ON ca."CellId" = cl."CellId"
        JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
        LEFT JOIN (
          SELECT "CellId", COUNT(*)::int AS member_count
          FROM "Members"
          GROUP BY "CellId"
        ) mc ON mc."CellId" = cl."CellId"
        CROSS JOIN (
          SELECT COUNT(DISTINCT "SundayService")::int AS wk
          FROM "Sunday"
          WHERE "SundayService" >= $1
        ) pd
        WHERE s."SundayService" >= $1
        GROUP BY cl."UserId", mc.member_count, pd.wk
      `, [dateFrom]);

      const cellPerfMap = {};
      for (const r of cellPerfRes.rows) {
        cellPerfMap[r.user_id] = {
          total:          r.total,
          expected:       r.expected,
          memberCount:    r.member_count,
          weekCount:      r.week_count,
          sundayPresent:  r.sunday_present,
          tuesdayPresent: r.tuesday_present,
          cellPresent:    r.cell_present,
          sundayPct:      parseFloat(r.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(r.tuesday_pct ?? 0),
          cellPct:        parseFloat(r.cell_pct    ?? 0)
        };
      }

      // Zone perf per leader — denominator = zone_member_count × week_count_in_period
      // contributingCells = number of distinct cells that filed attendance records in period
      const zonePerfRes = await pool.query(`
        SELECT
          zl."UserId"                                                                          AS user_id,
          COUNT(*)                                                                   ::int     AS total,
          COALESCE(mc.member_count, 0)                                               ::int     AS member_count,
          pd.wk                                                                      ::int     AS week_count,
          (COALESCE(mc.member_count, 0) * pd.wk)                                    ::int     AS expected,
          COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1)                         ::int     AS sunday_present,
          COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1)                         ::int     AS tuesday_present,
          COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)                         ::int     AS cell_present,
          COUNT(DISTINCT ca."CellId")                                               ::int     AS contributing_cells,
          ROUND(COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1) * 100.0 / NULLIF(COALESCE(mc.member_count, 0) * pd.wk, 0), 2) AS sunday_pct,
          ROUND(COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1) * 100.0 / NULLIF(COALESCE(mc.member_count, 0) * pd.wk, 0), 2) AS tuesday_pct,
          ROUND(COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1) * 100.0 / NULLIF(COALESCE(mc.member_count, 0) * pd.wk, 0), 2) AS cell_pct
        FROM "ZonalLeaders" zl
        JOIN "CellAttendance" ca ON ca."ZoneId" = zl."ZoneId"
        JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
        LEFT JOIN (
          SELECT "ZoneId", COUNT(*)::int AS member_count
          FROM "Members"
          GROUP BY "ZoneId"
        ) mc ON mc."ZoneId" = zl."ZoneId"
        CROSS JOIN (
          SELECT COUNT(DISTINCT "SundayService")::int AS wk
          FROM "Sunday"
          WHERE "SundayService" >= $1
        ) pd
        WHERE s."SundayService" >= $1
        GROUP BY zl."UserId", mc.member_count, pd.wk
      `, [dateFrom]);

      const zonePerfMap = {};
      for (const r of zonePerfRes.rows) {
        zonePerfMap[r.user_id] = {
          total:              r.total,
          expected:           r.expected,
          memberCount:        r.member_count,
          weekCount:          r.week_count,
          sundayPresent:      r.sunday_present,
          tuesdayPresent:     r.tuesday_present,
          cellPresent:        r.cell_present,
          contributingCells:  r.contributing_cells,
          sundayPct:          parseFloat(r.sunday_pct  ?? 0),
          tuesdayPct:         parseFloat(r.tuesday_pct ?? 0),
          cellPct:            parseFloat(r.cell_pct    ?? 0)
        };
      }

      // Build a lookup of assistants grouped by departmentId
      const assistantsByDept = {};
      for (const a of assistLeaders) {
        if (!assistantsByDept[a.departmentId]) assistantsByDept[a.departmentId] = [];
        assistantsByDept[a.departmentId].push({ id: a.id, name: a.name, email: a.email, phone: a.phone, lastLogin: a.lastLogin });
      }

      return {
        zonalLeaders: zonalRes.rows.map(u => ({
          id: u.Id, name: u.name, email: u.Email, phone: u.PhoneNumber, lastLogin: u.last_login,
          zone: u.zone_name, zoneId: u.zone_id,
          cellCount: u.cell_count, memberCount: u.member_count,
          performance: zonePerfMap[u.Id] ?? { sundayPct: 0, tuesdayPct: 0, cellPct: 0, total: 0, expected: 0, memberCount: 0, weekCount: 0, sundayPresent: 0, tuesdayPresent: 0, cellPresent: 0, contributingCells: 0 }
        })),
        cellLeaders: cellRes.rows.map(u => ({
          id: u.Id, name: u.name, email: u.Email, phone: u.PhoneNumber, lastLogin: u.last_login,
          cell: u.cell_name, cellId: u.cell_id, zone: u.zone_name, zoneId: u.zone_id,
          isAssistant: u.IsAssistant, memberCount: u.member_count,
          performance: cellPerfMap[u.Id] ?? { sundayPct: 0, tuesdayPct: 0, cellPct: 0, total: 0, expected: 0, memberCount: 0, weekCount: 0, sundayPresent: 0, tuesdayPresent: 0, cellPresent: 0 }
        })),
        // deptLeaders: one entry per leader (no assistants in the flat list).
        // Each entry carries an `assistants` array for tree rendering in the UI.
        deptLeaders: deptsRes.rows
          .filter(d => d.leader_id)
          .map(d => ({
            id: d.leader_id, name: d.leader_name, email: d.Email, phone: d.PhoneNumber,
            lastLogin: d.UpdatedAt, department: d.dept_name, departmentId: d.dept_id,
            performance: deptPerfMap[d.leader_id] ?? { sundayPct: 0, tuesdayPct: 0, cellPct: 0, total: 0, expected: 0, maxWeekly: 0, weekCount: deptWeekCount, sundayPresent: 0, tuesdayPresent: 0, cellPresent: 0 },
            assistants: assistantsByDept[d.dept_id] ?? []
          }))
      };
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[admin leaders]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

// ─── Admin Overview Analytics ────────────────────────────────────────────────
// GET /analytics/admin/overview?period=3
// Rewritten to use LATERAL subqueries — avoids Zones × Members × CellAttendance
// Cartesian product that causes PostgreSQL to write huge temp files.
// Percentages: COUNT(status=1) / COUNT(total) independently per service.
// No cross-service additions used.
router.get('/analytics/admin/overview', async (req, res) => {
  try {
    const { period = '3' } = req.query;
    const key = `admin-overview:${period}`;

    const data = await cached(key, async () => {
      const dateFrom = getDateFrom(period);

      // ── 1. Overall KPIs + static counts (all fast, no cross-product) ─────
      const [cellKpiRes, deptKpiRes, countsRes] = await Promise.all([
        pool.query(`
          SELECT
            COUNT(*)                                                      ::int  AS total,
            COUNT(*) FILTER (WHERE s."AttendanceStatus" = 1)             ::int  AS sunday_present,
            COUNT(*) FILTER (WHERE t."AttendanceStatus" = 1)             ::int  AS tuesday_present,
            COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)            ::int  AS cell_present,
            ROUND(COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE s."AttendanceStatus"  NOT IN (0,6)), 0), 2) AS sunday_pct,
            ROUND(COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE t."AttendanceStatus"  NOT IN (0,6)), 0), 2) AS tuesday_pct,
            ROUND(COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE cm."AttendanceStatus" NOT IN (0,6)), 0), 2) AS cell_pct
          FROM "CellAttendance" ca
          JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
          JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
          JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
          WHERE s."SundayService" >= $1
        `, [dateFrom]),
        pool.query(`
          SELECT
            COUNT(*)                                                      ::int  AS total,
            COUNT(*) FILTER (WHERE s."AttendanceStatus" = 1)             ::int  AS sunday_present,
            COUNT(*) FILTER (WHERE t."AttendanceStatus" = 1)             ::int  AS tuesday_present,
            COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)            ::int  AS cell_present,
            ROUND(COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE s."AttendanceStatus"  NOT IN (0,6)), 0), 2) AS sunday_pct,
            ROUND(COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE t."AttendanceStatus"  NOT IN (0,6)), 0), 2) AS tuesday_pct,
            ROUND(COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE cm."AttendanceStatus" NOT IN (0,6)), 0), 2) AS cell_pct
          FROM "DepartmentAttendances" da
          JOIN "Sunday"      s  ON da."SundayServiceId"  = s."Id"
          JOIN "Tuesday"     t  ON da."TuesdayServiceId" = t."Id"
          JOIN "CellMeeting" cm ON da."CellMeetingId"    = cm."Id"
          WHERE s."SundayService" >= $1
        `, [dateFrom]),
        pool.query(`
          SELECT
            (SELECT COUNT(*) FROM "Members")::int     AS members,
            (SELECT COUNT(*) FROM "Cells")::int       AS cells,
            (SELECT COUNT(*) FROM "Zones")::int       AS zones,
            (SELECT COUNT(*) FROM "Departments")::int AS depts
        `)
      ]);

      // ── 2. Monthly cell attendance trend ───────────────────────────────
      const trendRes = await pool.query(`
        SELECT
          to_char(date_trunc('month', s."SundayService"), 'Mon YYYY')    AS label,
          date_trunc('month', s."SundayService")                         AS sort_key,
          COUNT(*)                                               ::int    AS total,
          COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1)    ::int    AS sunday_present,
          COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1)    ::int    AS tuesday_present,
          COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)    ::int    AS cell_present,
          ROUND(COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE s."AttendanceStatus"  NOT IN (0,6)), 0), 1) AS sunday_pct,
          ROUND(COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE t."AttendanceStatus"  NOT IN (0,6)), 0), 1) AS tuesday_pct,
          ROUND(COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE cm."AttendanceStatus" NOT IN (0,6)), 0), 1) AS cell_pct
        FROM "CellAttendance" ca
        JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
        WHERE s."SundayService" >= $1
        GROUP BY date_trunc('month', s."SundayService")
        ORDER BY sort_key ASC
      `, [dateFrom]);

      // ── 3. Monthly dept attendance trend ──────────────────────────────
      const deptTrendRes = await pool.query(`
        SELECT
          to_char(date_trunc('month', s."SundayService"), 'Mon YYYY')    AS label,
          date_trunc('month', s."SundayService")                         AS sort_key,
          COUNT(*)                                               ::int    AS total,
          COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1)    ::int    AS sunday_present,
          COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1)    ::int    AS tuesday_present,
          COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)    ::int    AS cell_present,
          ROUND(COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE s."AttendanceStatus"  NOT IN (0,6)), 0), 1) AS sunday_pct,
          ROUND(COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE t."AttendanceStatus"  NOT IN (0,6)), 0), 1) AS tuesday_pct,
          ROUND(COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1) * 100.0 / NULLIF(COUNT(*) FILTER (WHERE cm."AttendanceStatus" NOT IN (0,6)), 0), 1) AS cell_pct
        FROM "DepartmentAttendances" da
        JOIN "Sunday"      s  ON da."SundayServiceId"  = s."Id"
        JOIN "Tuesday"     t  ON da."TuesdayServiceId" = t."Id"
        JOIN "CellMeeting" cm ON da."CellMeetingId"    = cm."Id"
        WHERE s."SundayService" >= $1
        GROUP BY date_trunc('month', s."SundayService")
        ORDER BY sort_key ASC
      `, [dateFrom]);

      // ── 4. Zone performance — denominator = zone_members × period_weeks ─
      // Zones with fewer filings are penalised (unfiled weeks → 0 present).
      const zonePerfRes = await pool.query(`
        WITH period_weeks AS (
          SELECT COUNT(DISTINCT "SundayService")::int AS wk
          FROM "Sunday" WHERE "SundayService" >= $1
        ),
        zone_members AS (
          SELECT "ZoneId", COUNT(*)::int AS member_count
          FROM "Members" GROUP BY "ZoneId"
        )
        SELECT
          z."Name"                                                                            AS zone,
          z."Id"                                                                              AS zone_id,
          COALESCE(zm.member_count, 0)                                                       AS members,
          (SELECT COUNT(*) FROM "Cells" c WHERE c."ZoneId" = z."Id")::int                  AS cells,
          COALESCE(att.total, 0)                                                             AS total,
          COALESCE(att.sunday_present, 0)                                                   AS sunday_present,
          COALESCE(att.tuesday_present, 0)                                                  AS tuesday_present,
          COALESCE(att.cell_present, 0)                                                     AS cell_present,
          pw.wk                                                                             AS week_count,
          (COALESCE(zm.member_count, 0) * pw.wk)                                           AS expected,
          CASE WHEN (COALESCE(zm.member_count, 0) * pw.wk) = 0 THEN 0
               ELSE ROUND(COALESCE(att.sunday_present,  0) * 100.0 / (COALESCE(zm.member_count, 0) * pw.wk), 1) END AS sunday_pct,
          CASE WHEN (COALESCE(zm.member_count, 0) * pw.wk) = 0 THEN 0
               ELSE ROUND(COALESCE(att.tuesday_present, 0) * 100.0 / (COALESCE(zm.member_count, 0) * pw.wk), 1) END AS tuesday_pct,
          CASE WHEN (COALESCE(zm.member_count, 0) * pw.wk) = 0 THEN 0
               ELSE ROUND(COALESCE(att.cell_present,    0) * 100.0 / (COALESCE(zm.member_count, 0) * pw.wk), 1) END AS cell_pct
        FROM "Zones" z
        CROSS JOIN period_weeks pw
        LEFT JOIN zone_members zm ON zm."ZoneId" = z."Id"
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)                                                       ::int AS total,
            COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1)             ::int AS sunday_present,
            COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1)             ::int AS tuesday_present,
            COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)             ::int AS cell_present
          FROM "CellAttendance" ca
          JOIN "Sunday"      s  ON ca."SundayServiceId"  = s."Id" AND s."SundayService" >= $1
          JOIN "Tuesday"     t  ON ca."TuesdayServiceId" = t."Id"
          JOIN "CellMeeting" cm ON ca."CellMeetingId"    = cm."Id"
          WHERE ca."ZoneId" = z."Id"
        ) att ON true
        ORDER BY sunday_pct DESC NULLS LAST
      `, [dateFrom]);

      // ── 5. Dept performance — denominator = max_weekly × period_weeks ──
      // max_weekly ≈ dept member count (largest single-week filing for this leader).
      const deptPerfRes = await pool.query(`
        WITH period_weeks AS (
          SELECT COUNT(DISTINCT "SundayService")::int AS wk
          FROM "Sunday" WHERE "SundayService" >= $1
        )
        SELECT
          d."Name"                                                                            AS dept,
          d."Id"                                                                              AS dept_id,
          d."IsActive",
          COALESCE(att.total, 0)                                                             AS total,
          COALESCE(att.sunday_present, 0)                                                   AS sunday_present,
          COALESCE(att.tuesday_present, 0)                                                  AS tuesday_present,
          COALESCE(att.cell_present, 0)                                                     AS cell_present,
          COALESCE(att.max_weekly, 0)                                                       AS max_weekly,
          pw.wk                                                                             AS week_count,
          (COALESCE(att.max_weekly, 0) * pw.wk)                                            AS expected,
          CASE WHEN (COALESCE(att.max_weekly, 0) * pw.wk) = 0 THEN 0
               ELSE ROUND(COALESCE(att.sunday_present,  0) * 100.0 / (COALESCE(att.max_weekly, 0) * pw.wk), 1) END AS sunday_pct,
          CASE WHEN (COALESCE(att.max_weekly, 0) * pw.wk) = 0 THEN 0
               ELSE ROUND(COALESCE(att.tuesday_present, 0) * 100.0 / (COALESCE(att.max_weekly, 0) * pw.wk), 1) END AS tuesday_pct,
          CASE WHEN (COALESCE(att.max_weekly, 0) * pw.wk) = 0 THEN 0
               ELSE ROUND(COALESCE(att.cell_present,    0) * 100.0 / (COALESCE(att.max_weekly, 0) * pw.wk), 1) END AS cell_pct
        FROM "Departments" d
        -- LEFT JOIN so departments with no leader assigned are still included
        LEFT JOIN "AspNetUsers" lu ON lu."Id" = d."DepartmentLeaderId"
        CROSS JOIN period_weeks pw
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)                                                       ::int AS total,
            COUNT(*) FILTER (WHERE s."AttendanceStatus"  = 1)             ::int AS sunday_present,
            COUNT(*) FILTER (WHERE t."AttendanceStatus"  = 1)             ::int AS tuesday_present,
            COUNT(*) FILTER (WHERE cm."AttendanceStatus" = 1)             ::int AS cell_present,
            (
              SELECT COALESCE(MAX(wkc), 0)::int
              FROM (
                SELECT COUNT(*)::int AS wkc
                FROM "DepartmentAttendances" da2
                JOIN "Sunday" s2 ON da2."SundayServiceId" = s2."Id"
                WHERE da2."DepartmentalLeaderId" = lu."Id"
                  AND s2."SundayService" >= $1
                GROUP BY da2."SundayServiceId"
              ) wk_inner
            )                                                              ::int AS max_weekly
          FROM "DepartmentAttendances" da
          JOIN "Sunday"      s  ON da."SundayServiceId"  = s."Id" AND s."SundayService" >= $1
          JOIN "Tuesday"     t  ON da."TuesdayServiceId" = t."Id"
          JOIN "CellMeeting" cm ON da."CellMeetingId"    = cm."Id"
          WHERE da."DepartmentalLeaderId" = lu."Id"
        ) att ON lu."Id" IS NOT NULL
        ORDER BY sunday_pct DESC NULLS LAST
      `, [dateFrom]);

      const ck     = cellKpiRes.rows[0];
      const dk     = deptKpiRes.rows[0];
      const counts = countsRes.rows[0];

      return {
        counts: {
          members: counts.members,
          cells:   counts.cells,
          zones:   counts.zones,
          depts:   counts.depts
        },
        cellKpi: {
          total:          ck.total,
          sundayPresent:  ck.sunday_present,
          tuesdayPresent: ck.tuesday_present,
          cellPresent:    ck.cell_present,
          sundayPct:      parseFloat(ck.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(ck.tuesday_pct ?? 0),
          cellPct:        parseFloat(ck.cell_pct    ?? 0)
        },
        deptKpi: {
          total:          dk.total,
          sundayPresent:  dk.sunday_present,
          tuesdayPresent: dk.tuesday_present,
          cellPresent:    dk.cell_present,
          sundayPct:      parseFloat(dk.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(dk.tuesday_pct ?? 0),
          cellPct:        parseFloat(dk.cell_pct    ?? 0)
        },
        cellTrend: trendRes.rows.map(r => ({
          label:          r.label,
          total:          r.total,
          sundayPresent:  r.sunday_present,
          tuesdayPresent: r.tuesday_present,
          cellPresent:    r.cell_present,
          sundayPct:      parseFloat(r.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(r.tuesday_pct ?? 0),
          cellPct:        parseFloat(r.cell_pct    ?? 0)
        })),
        deptTrend: deptTrendRes.rows.map(r => ({
          label:          r.label,
          total:          r.total,
          sundayPresent:  r.sunday_present,
          tuesdayPresent: r.tuesday_present,
          cellPresent:    r.cell_present,
          sundayPct:      parseFloat(r.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(r.tuesday_pct ?? 0),
          cellPct:        parseFloat(r.cell_pct    ?? 0)
        })),
        zonePerformance: zonePerfRes.rows.map(r => ({
          zone:           r.zone,
          zoneId:         r.zone_id,
          members:        r.members,
          cells:          r.cells,
          total:          r.total,
          expected:       r.expected,
          weekCount:      r.week_count,
          sundayPresent:  r.sunday_present,
          tuesdayPresent: r.tuesday_present,
          cellPresent:    r.cell_present,
          sundayPct:      parseFloat(r.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(r.tuesday_pct ?? 0),
          cellPct:        parseFloat(r.cell_pct    ?? 0)
        })),
        deptPerformance: deptPerfRes.rows.map(r => ({
          dept:           r.dept,
          deptId:         r.dept_id,
          isActive:       r.IsActive,
          total:          r.total,
          expected:       r.expected,
          maxWeekly:      r.max_weekly,
          weekCount:      r.week_count,
          sundayPresent:  r.sunday_present,
          tuesdayPresent: r.tuesday_present,
          cellPresent:    r.cell_present,
          sundayPct:      parseFloat(r.sunday_pct  ?? 0),
          tuesdayPct:     parseFloat(r.tuesday_pct ?? 0),
          cellPct:        parseFloat(r.cell_pct    ?? 0)
        }))
      };
    });

    res.json(wrapResult(data));
  } catch (err) {
    console.error('[admin overview]', err.message);
    res.status(500).json(errResult(err.message));
  }
});

export default router;
