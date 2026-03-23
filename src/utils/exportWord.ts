import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';

const PERIOD_LABELS: Record<string, string> = {
  '1': 'Last 7 Days',
  '2': 'Last 30 Days',
  '3': 'Last Year',
};

function pct(v: number) {
  return `${v.toFixed(1)}%`;
}

// Thin border style for table cells
const THIN_BORDER = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
  left:   { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
  right:  { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
};

function headerCell(text: string, width: number) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: THIN_BORDER,
    shading: { type: ShadingType.SOLID, color: '1E3A5F', fill: '1E3A5F' },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 18 })],
      alignment: AlignmentType.CENTER,
    })],
  });
}

function dataCell(text: string, width: number, bold = false, color?: string) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: THIN_BORDER,
    children: [new Paragraph({
      children: [new TextRun({ text, bold, color: color ?? '333333', size: 18 })],
      alignment: AlignmentType.LEFT,
    })],
  });
}

function sectionHeading(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
  });
}

function kpiTable(rows: [string, string][]) {
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: rows.map(([label, value]) => new TableRow({
      children: [
        dataCell(label, 5000, true),
        dataCell(value, 4000, false, pctColor(value)),
      ],
    })),
  });
}

function pctColor(v: string): string {
  const n = parseFloat(v);
  if (isNaN(n)) return '333333';
  if (n >= 75) return '166534';
  if (n >= 50) return '92400E';
  return 'B91C1C';
}

function makeTable(headers: { label: string; width: number }[], bodyRows: string[][]): Table {
  const headerRow = new TableRow({
    children: headers.map(h => headerCell(h.label, h.width)),
    tableHeader: true,
  });

  const dataRows = bodyRows.map((cells, ri) => new TableRow({
    children: cells.map((c, ci) => {
      const shading = ri % 2 === 0
        ? undefined
        : { type: ShadingType.SOLID, color: 'F0F4FA', fill: 'F0F4FA' };
      return new TableCell({
        width: { size: headers[ci]?.width ?? 1000, type: WidthType.DXA },
        borders: THIN_BORDER,
        shading,
        children: [new Paragraph({
          children: [new TextRun({ text: c, size: 18 })],
        })],
      });
    }),
  }));

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
  });
}

function spacer() {
  return new Paragraph({ text: '', spacing: { after: 100 } });
}

export async function exportAnalyticsToWord(data: TAdminOverview, period: string) {
  const periodLabel = PERIOD_LABELS[period] ?? period;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  // Title & subtitle
  const title = new Paragraph({
    children: [new TextRun({ text: 'Dominion City VI — Analytics Report', bold: true, size: 36, color: '1E3A5F' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
  });

  const subtitle = new Paragraph({
    children: [new TextRun({ text: `Period: ${periodLabel}   •   Generated: ${dateStr}`, size: 20, color: '666666' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 320 },
  });

  // ── Church Counts
  const countsTable = makeTable(
    [
      { label: 'Metric', width: 4500 },
      { label: 'Value',  width: 4500 },
    ],
    [
      ['Total Members', String(data.counts.members)],
      ['Total Cells',   String(data.counts.cells)],
      ['Total Zones',   String(data.counts.zones)],
      ['Total Departments', String(data.counts.depts)],
    ]
  );

  // ── Cell KPIs
  const cellKpiTable = makeTable(
    [
      { label: 'Service', width: 3000 },
      { label: 'Attendance %', width: 2000 },
      { label: 'Present', width: 2000 },
      { label: 'Total Records', width: 2000 },
    ],
    [
      ['Sunday Service',     pct(data.cellKpi.sundayPct),  String(data.cellKpi.sundayPresent),  String(data.cellKpi.total)],
      ['Tuesday Service',    pct(data.cellKpi.tuesdayPct), String(data.cellKpi.tuesdayPresent), String(data.cellKpi.total)],
      ['Cell Meeting (Fri)', pct(data.cellKpi.cellPct),    String(data.cellKpi.cellPresent),    String(data.cellKpi.total)],
    ]
  );

  // ── Dept KPIs
  const deptKpiTable = makeTable(
    [
      { label: 'Service', width: 3000 },
      { label: 'Attendance %', width: 2000 },
      { label: 'Present', width: 2000 },
      { label: 'Total Records', width: 2000 },
    ],
    [
      ['Sunday Service',     pct(data.deptKpi.sundayPct),  String(data.deptKpi.sundayPresent),  String(data.deptKpi.total)],
      ['Tuesday Service',    pct(data.deptKpi.tuesdayPct), String(data.deptKpi.tuesdayPresent), String(data.deptKpi.total)],
      ['Friday (Cell)',      pct(data.deptKpi.cellPct),    String(data.deptKpi.cellPresent),    String(data.deptKpi.total)],
    ]
  );

  // ── Zone Performance table
  const zoneHeaders = [
    { label: '#',          width: 500  },
    { label: 'Zone',       width: 2200 },
    { label: 'Cells',      width: 700  },
    { label: 'Members',    width: 900  },
    { label: 'Sun %',      width: 900  },
    { label: 'Tue %',      width: 900  },
    { label: 'Cell %',     width: 900  },
    { label: 'Expected',   width: 1000 },
  ];
  const zoneRows = data.zonePerformance.map((z, i) => [
    String(i + 1),
    z.zone,
    String(z.cells),
    String(z.members),
    pct(z.sundayPct),
    pct(z.tuesdayPct),
    pct(z.cellPct),
    String(z.expected),
  ]);
  const zonePerfTable = makeTable(zoneHeaders, zoneRows);

  // ── Dept Performance table
  const deptHeaders = [
    { label: '#',          width: 500  },
    { label: 'Department', width: 2700 },
    { label: 'Sun %',      width: 900  },
    { label: 'Tue %',      width: 900  },
    { label: 'Fri %',      width: 900  },
    { label: 'Expected',   width: 1000 },
    { label: 'Wks',        width: 600  },
    { label: 'Max/Wk',     width: 700  },
  ];
  const deptRows = data.deptPerformance.map((d, i) => [
    String(i + 1),
    d.dept,
    pct(d.sundayPct),
    pct(d.tuesdayPct),
    pct(d.cellPct),
    String(d.expected),
    String(d.weekCount),
    String(d.maxWeekly),
  ]);
  const deptPerfTable = makeTable(deptHeaders, deptRows);

  // ── Cell Trend (if present)
  const cellTrendSection: (Paragraph | Table)[] = [];
  if (data.cellTrend.length > 0) {
    cellTrendSection.push(sectionHeading('Cell Attendance Trend'));
    const trendHeaders = [
      { label: 'Week',       width: 2000 },
      { label: 'Sun %',      width: 1000 },
      { label: 'Sun ✓',      width: 900  },
      { label: 'Tue %',      width: 1000 },
      { label: 'Tue ✓',      width: 900  },
      { label: 'Cell %',     width: 1000 },
      { label: 'Cell ✓',     width: 900  },
      { label: 'Total',      width: 800  },
    ];
    const trendRows = data.cellTrend.map(t => [
      t.label,
      pct(t.sundayPct),
      String(t.sundayPresent),
      pct(t.tuesdayPct),
      String(t.tuesdayPresent),
      pct(t.cellPct),
      String(t.cellPresent),
      String(t.total),
    ]);
    cellTrendSection.push(makeTable(trendHeaders, trendRows));
  }

  // ── Dept Trend (if present)
  const deptTrendSection: (Paragraph | Table)[] = [];
  if (data.deptTrend.length > 0) {
    deptTrendSection.push(sectionHeading('Department Attendance Trend'));
    const trendHeaders = [
      { label: 'Week',       width: 2000 },
      { label: 'Sun %',      width: 1000 },
      { label: 'Sun ✓',      width: 900  },
      { label: 'Tue %',      width: 1000 },
      { label: 'Tue ✓',      width: 900  },
      { label: 'Fri %',      width: 1000 },
      { label: 'Fri ✓',      width: 900  },
      { label: 'Total',      width: 800  },
    ];
    const trendRows = data.deptTrend.map(t => [
      t.label,
      pct(t.sundayPct),
      String(t.sundayPresent),
      pct(t.tuesdayPct),
      String(t.tuesdayPresent),
      pct(t.cellPct),
      String(t.cellPresent),
      String(t.total),
    ]);
    deptTrendSection.push(makeTable(trendHeaders, trendRows));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 900, right: 900 },
        },
      },
      children: [
        title,
        subtitle,

        sectionHeading('Church Overview'),
        countsTable,
        spacer(),

        sectionHeading('Cell Attendance KPIs'),
        cellKpiTable,
        spacer(),

        sectionHeading('Department Attendance KPIs'),
        deptKpiTable,
        spacer(),

        ...cellTrendSection,
        ...(cellTrendSection.length ? [spacer()] : []),

        ...deptTrendSection,
        ...(deptTrendSection.length ? [spacer()] : []),

        sectionHeading('Zone Performance (All Zones — sorted by Sunday %)'),
        zonePerfTable,
        spacer(),

        sectionHeading('Department Performance (All Departments — sorted by Sunday %)'),
        deptPerfTable,
        spacer(),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `DCVI_Analytics_${periodLabel.replace(/\s+/g, '_')}_${today()}.docx`);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
