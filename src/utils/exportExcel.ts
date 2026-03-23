import * as XLSX from 'xlsx';

const PERIOD_LABELS: Record<string, string> = {
  '1': '7days',
  '2': '30days',
  '3': '1year',
};

function pct(v: number) {
  return `${v.toFixed(1)}%`;
}

function setColWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws['!cols'] = widths.map(w => ({ wch: w }));
}

// ── Leaders ──────────────────────────────────────────────────────────────────

export function exportLeadersToExcel(data: TLeadersOverview, period: string) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Zonal Leaders
  const zonalRows = data.zonalLeaders.map((l, i) => ({
    '#': i + 1,
    'Name': l.name,
    'Email': l.email,
    'Phone': l.phone ?? '',
    'Zone': l.zone,
    'Cells': l.cellCount,
    'Members': l.memberCount,
    'Sun %': pct(l.performance.sundayPct),
    'Tue %': pct(l.performance.tuesdayPct),
    'Cell %': pct(l.performance.cellPct),
    'Last Login': l.lastLogin ?? 'Never',
  }));
  const wsZonal = XLSX.utils.json_to_sheet(zonalRows);
  setColWidths(wsZonal, [4, 28, 32, 16, 22, 7, 9, 8, 8, 8, 22]);
  XLSX.utils.book_append_sheet(wb, wsZonal, 'Zonal Leaders');

  // Sheet 2: Cell Leaders
  const cellRows = data.cellLeaders.map((l, i) => ({
    '#': i + 1,
    'Name': l.name,
    'Email': l.email,
    'Phone': l.phone ?? '',
    'Zone': l.zone,
    'Cell': l.cell,
    'Role': l.isAssistant ? 'Assistant' : 'Leader',
    'Members': l.memberCount,
    'Sun %': pct(l.performance.sundayPct),
    'Tue %': pct(l.performance.tuesdayPct),
    'Cell %': pct(l.performance.cellPct),
    'Last Login': l.lastLogin ?? 'Never',
  }));
  const wsCell = XLSX.utils.json_to_sheet(cellRows);
  setColWidths(wsCell, [4, 28, 32, 16, 18, 20, 10, 9, 8, 8, 8, 22]);
  XLSX.utils.book_append_sheet(wb, wsCell, 'Cell Leaders');

  // Sheet 3: Dept Leaders — flatten leader + assistants
  const deptRows: Record<string, string | number>[] = [];
  for (const l of data.deptLeaders) {
    deptRows.push({
      'Department': l.department,
      'Name': l.name,
      'Role': 'Leader',
      'Email': l.email,
      'Phone': l.phone ?? '',
      'Sun %': pct(l.performance.sundayPct),
      'Tue %': pct(l.performance.tuesdayPct),
      'Fri %': pct(l.performance.cellPct),
      'Records': l.performance.total ?? 0,
      'Last Login': l.lastLogin ?? 'Never',
    });
    for (const a of l.assistants) {
      deptRows.push({
        'Department': l.department,
        'Name': a.name,
        'Role': 'Assistant',
        'Email': a.email,
        'Phone': a.phone ?? '',
        'Sun %': '—',
        'Tue %': '—',
        'Fri %': '—',
        'Records': '—',
        'Last Login': a.lastLogin ?? 'Never',
      });
    }
  }
  const wsDept = XLSX.utils.json_to_sheet(deptRows);
  setColWidths(wsDept, [22, 28, 10, 32, 16, 8, 8, 8, 9, 22]);
  XLSX.utils.book_append_sheet(wb, wsDept, 'Dept Leaders');

  const label = PERIOD_LABELS[period] ?? period;
  XLSX.writeFile(wb, `DCVI_Leaders_${label}_${today()}.xlsx`);
}

// ── Users ─────────────────────────────────────────────────────────────────────

const GENDER_MAP: Record<number, string> = { 0: 'Unknown', 1: 'Male', 2: 'Female' };
const MARITAL_MAP: Record<number, string> = { 0: 'Single', 1: 'Married', 2: 'Divorced', 3: 'Widowed', 4: 'Unknown' };
const STATUS_MAP: Record<string, string> = { '0': 'Active', '1': 'Pending', '2': 'Deleted', '3': 'Blocked', '4': 'LockedOut' };

export function exportUsersToExcel(users: TAdminUserItem[]) {
  const rows = users.map((u, i) => ({
    '#': i + 1,
    'First Name': u.firstName ?? '',
    'Last Name': u.lastName ?? '',
    'Email': u.email ?? '',
    'Phone': u.phoneNumber ?? '',
    'Address': u.address ?? '',
    'Occupation': u.occupation ?? '',
    'Gender': GENDER_MAP[u.gender] ?? 'Unknown',
    'Marital Status': MARITAL_MAP[u.maritalStatus] ?? 'Unknown',
    'Status': STATUS_MAP[String(u.status)] ?? 'Unknown',
    'Departments': Array.isArray(u.departments) ? u.departments.join(', ') : '',
    'Trainings': Array.isArray(u.trainings) ? u.trainings.join(', ') : '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  setColWidths(ws, [4, 18, 18, 34, 16, 30, 20, 10, 14, 12, 30, 30]);
  XLSX.utils.book_append_sheet(wb, ws, 'Users');
  XLSX.writeFile(wb, `DCVI_Users_${today()}.xlsx`);
}

// ── Cell Members ──────────────────────────────────────────────────────────────

export function exportCellMembersToExcel(members: TCellMember[], label = 'Cell') {
  const rows = members.map((m, i) => ({
    '#': i + 1,
    'First Name': m.firstName ?? '',
    'Last Name': m.lastName ?? '',
    'Email': m.email ?? '',
    'Phone': m.phoneNumber ?? '',
    'Date Registered': m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  setColWidths(ws, [4, 20, 20, 34, 16, 18]);
  XLSX.utils.book_append_sheet(wb, ws, 'Members');
  XLSX.writeFile(wb, `DCVI_${label.replace(/\s+/g, '_')}_Members_${today()}.xlsx`);
}

// ── Department Members ────────────────────────────────────────────────────────

export function exportDeptMembersToExcel(people: People[], deptName = 'Department') {
  const rows = people.map((p, i) => ({
    '#': i + 1,
    'Name': `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim(),
    'Email': p.email ?? '',
    'Phone': p.phoneNumber ?? '',
    'Role': p.isLeader ? 'Leader' : p.isAssistant ? 'Assistant' : 'Member',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  setColWidths(ws, [4, 28, 34, 16, 12]);
  XLSX.utils.book_append_sheet(wb, ws, 'Members');
  XLSX.writeFile(wb, `DCVI_${deptName.replace(/\s+/g, '_')}_Members_${today()}.xlsx`);
}

// ── Analytics (full data to Excel) ───────────────────────────────────────────

export function exportAnalyticsToExcel(data: TAdminOverview, period: string) {
  const label = PERIOD_LABELS[period] ?? period;
  const wb = XLSX.utils.book_new();

  // Sheet 1: Church KPIs
  const kpiRows = [
    { 'Category': 'Church Overview', 'Metric': 'Total Members',    'Value': data.counts.members },
    { 'Category': 'Church Overview', 'Metric': 'Total Cells',      'Value': data.counts.cells   },
    { 'Category': 'Church Overview', 'Metric': 'Total Zones',      'Value': data.counts.zones   },
    { 'Category': 'Church Overview', 'Metric': 'Total Departments','Value': data.counts.depts   },
    { 'Category': 'Cell KPIs', 'Metric': 'Sunday %',    'Value': pct(data.cellKpi.sundayPct),  'Present': data.cellKpi.sundayPresent,  'Total Records': data.cellKpi.total },
    { 'Category': 'Cell KPIs', 'Metric': 'Tuesday %',   'Value': pct(data.cellKpi.tuesdayPct), 'Present': data.cellKpi.tuesdayPresent, 'Total Records': data.cellKpi.total },
    { 'Category': 'Cell KPIs', 'Metric': 'Cell Mtg %',  'Value': pct(data.cellKpi.cellPct),    'Present': data.cellKpi.cellPresent,    'Total Records': data.cellKpi.total },
    { 'Category': 'Dept KPIs', 'Metric': 'Sunday %',    'Value': pct(data.deptKpi.sundayPct),  'Present': data.deptKpi.sundayPresent,  'Total Records': data.deptKpi.total },
    { 'Category': 'Dept KPIs', 'Metric': 'Tuesday %',   'Value': pct(data.deptKpi.tuesdayPct), 'Present': data.deptKpi.tuesdayPresent, 'Total Records': data.deptKpi.total },
    { 'Category': 'Dept KPIs', 'Metric': 'Friday %',    'Value': pct(data.deptKpi.cellPct),    'Present': data.deptKpi.cellPresent,    'Total Records': data.deptKpi.total },
  ];
  const wsKpi = XLSX.utils.json_to_sheet(kpiRows);
  setColWidths(wsKpi, [18, 20, 14, 10, 14]);
  XLSX.utils.book_append_sheet(wb, wsKpi, 'KPIs');

  // Sheet 2: Zone Performance
  const zoneRows = data.zonePerformance.map((z, i) => ({
    'Rank': i + 1,
    'Zone': z.zone,
    'Cells': z.cells,
    'Members': z.members,
    'Sun %': pct(z.sundayPct),
    'Sun Present': z.sundayPresent,
    'Tue %': pct(z.tuesdayPct),
    'Tue Present': z.tuesdayPresent,
    'Cell Mtg %': pct(z.cellPct),
    'Cell Present': z.cellPresent,
    'Expected': z.expected,
    'Week Count': z.weekCount,
  }));
  const wsZone = XLSX.utils.json_to_sheet(zoneRows);
  setColWidths(wsZone, [6, 22, 7, 9, 8, 11, 8, 11, 10, 12, 10, 11]);
  XLSX.utils.book_append_sheet(wb, wsZone, 'Zone Performance');

  // Sheet 3: Department Performance
  const deptRows = data.deptPerformance.map((d, i) => ({
    'Rank': i + 1,
    'Department': d.dept,
    'Sun %': pct(d.sundayPct),
    'Sun Present': d.sundayPresent,
    'Tue %': pct(d.tuesdayPct),
    'Tue Present': d.tuesdayPresent,
    'Fri %': pct(d.cellPct),
    'Fri Present': d.cellPresent,
    'Expected': d.expected,
    'Max Weekly': d.maxWeekly,
    'Week Count': d.weekCount,
  }));
  const wsDept = XLSX.utils.json_to_sheet(deptRows);
  setColWidths(wsDept, [6, 26, 8, 11, 8, 11, 8, 11, 10, 11, 11]);
  XLSX.utils.book_append_sheet(wb, wsDept, 'Dept Performance');

  // Sheet 4: Cell Trend
  if (data.cellTrend.length > 0) {
    const trendRows = data.cellTrend.map(t => ({
      'Week': t.label,
      'Sun %': pct(t.sundayPct),
      'Sun Present': t.sundayPresent,
      'Tue %': pct(t.tuesdayPct),
      'Tue Present': t.tuesdayPresent,
      'Cell Mtg %': pct(t.cellPct),
      'Cell Present': t.cellPresent,
      'Total': t.total,
    }));
    const wsTrend = XLSX.utils.json_to_sheet(trendRows);
    setColWidths(wsTrend, [14, 8, 11, 8, 11, 10, 12, 8]);
    XLSX.utils.book_append_sheet(wb, wsTrend, 'Cell Trend');
  }

  // Sheet 5: Dept Trend
  if (data.deptTrend.length > 0) {
    const trendRows = data.deptTrend.map(t => ({
      'Week': t.label,
      'Sun %': pct(t.sundayPct),
      'Sun Present': t.sundayPresent,
      'Tue %': pct(t.tuesdayPct),
      'Tue Present': t.tuesdayPresent,
      'Fri %': pct(t.cellPct),
      'Fri Present': t.cellPresent,
      'Total': t.total,
    }));
    const wsDeptTrend = XLSX.utils.json_to_sheet(trendRows);
    setColWidths(wsDeptTrend, [14, 8, 11, 8, 11, 8, 11, 8]);
    XLSX.utils.book_append_sheet(wb, wsDeptTrend, 'Dept Trend');
  }

  XLSX.writeFile(wb, `DCVI_Analytics_${label}_${today()}.xlsx`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10);
}
