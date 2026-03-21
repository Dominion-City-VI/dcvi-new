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
      ROUND(COUNT(CASE WHEN s."AttendanceStatus"  = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*),0), 2) AS "sundayService",
      ROUND(COUNT(CASE WHEN t."AttendanceStatus"  = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*),0), 2) AS "tuesdayAttendance",
      ROUND(COUNT(CASE WHEN cm."AttendanceStatus" = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*),0), 2) AS "cellAttendance"
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
        whereExtra = 'AND da."DepartmentId" = $2'; params.push(Id);
      } else if (roleType === 4 && Id) {
        whereExtra = 'AND ca."ZoneId" = $2'; params.push(Id);
      } else if ((roleType === 5 || roleType === 6) && Id) {
        whereExtra = 'AND ca."CellId" = $2'; params.push(Id);
      }

      const query = isDept ? `
        SELECT
          COUNT(*)::int AS total,
          COUNT(CASE WHEN s."AttendanceStatus" = 1 THEN 1 END)::int AS "totalSunday",
          COUNT(CASE WHEN t."AttendanceStatus" = 1 THEN 1 END)::int AS "totalTuesday",
          0::int AS "totalCellAttendees",
          ROUND(COUNT(CASE WHEN s."AttendanceStatus" = 1 THEN 1 END)*100.0/NULLIF(COUNT(*),0),2) AS "totalSundayPercentage",
          ROUND(COUNT(CASE WHEN t."AttendanceStatus" = 1 THEN 1 END)*100.0/NULLIF(COUNT(*),0),2) AS "totalTuesdayPercentage",
          0::numeric AS "totalCellAttendeesPercentage",
          ROUND((COUNT(CASE WHEN s."AttendanceStatus"=1 THEN 1 END)+COUNT(CASE WHEN t."AttendanceStatus"=1 THEN 1 END))*100.0/NULLIF(COUNT(*)*2,0),2) AS "totalPercentage"
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
          ROUND(COUNT(CASE WHEN s."AttendanceStatus" = 1 THEN 1 END)*100.0/NULLIF(COUNT(*),0),2)  AS "totalSundayPercentage",
          ROUND(COUNT(CASE WHEN t."AttendanceStatus" = 1 THEN 1 END)*100.0/NULLIF(COUNT(*),0),2)  AS "totalTuesdayPercentage",
          ROUND(COUNT(CASE WHEN cm."AttendanceStatus"= 1 THEN 1 END)*100.0/NULLIF(COUNT(*),0),2)  AS "totalCellAttendeesPercentage",
          ROUND((COUNT(CASE WHEN s."AttendanceStatus"=1 THEN 1 END)+COUNT(CASE WHEN t."AttendanceStatus"=1 THEN 1 END)+COUNT(CASE WHEN cm."AttendanceStatus"=1 THEN 1 END))*100.0/NULLIF(COUNT(*)*3,0),2) AS "totalPercentage"
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
        whereExtra = 'AND da."DepartmentId" = $2';
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

export default router;
