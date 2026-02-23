import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MAIWPStudent } from '../mock-data/malaysian-students';

interface AttendanceSummary {
  presentCount: number;
  lateCount: number;
  absentCount: number;
  totalDays: number;
  attendanceRate: string;
}

interface FeeRecord {
  month: string;
  amount: number;
  status: string;
  paidDate: string | null;
}

interface SubsidySummary {
  subsidyCategory: string;
  monthlySubsidy: number;
  totalSubsidyCredited: number;
  monthsCovered: number;
  fundSource: string;
}

interface StudentHealthSummary {
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: string;
  lastScreeningDate?: string;
}

interface CurriculumSummary {
  term: string;
  subject: string;
  score: number;
  grade: string;
  remark: string;
}

interface StudentReportOptions {
  profilePhotoUrl?: string;
  health?: StudentHealthSummary;
  curriculum?: CurriculumSummary[];
  comments?: string[];
  recommendations?: string[];
  aiAssessment?: {
    overview: string;
    strengths: string[];
    risks: string[];
    nextActions: string[];
    confidence?: number;
  };
}

type JsPdfWithTable = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

async function imageUrlToDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function ensurePageSpace(doc: JsPdfWithTable, currentY: number, required: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + required > pageHeight - 14) {
    doc.addPage();
    return 18;
  }
  return currentY;
}

export async function generateStudentPDF(
  student: MAIWPStudent,
  attendance: AttendanceSummary,
  feeData: FeeRecord[],
  subsidy: SubsidySummary,
  options: StudentReportOptions = {},
) {
  const doc = new jsPDF() as JsPdfWithTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // ─── Header ──────────────────────────────────────────────
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MAIWP', 14, y + 5);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Majlis Agama Islam Wilayah Persekutuan', 14, y + 12);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Report', pageWidth - 14, y + 5, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const now = new Date();
  doc.text(
    `Generated: ${now.toLocaleDateString('en-MY', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    pageWidth - 14,
    y + 12,
    { align: 'right' },
  );

  y = 45;
  doc.setTextColor(0, 0, 0);

  if (options.profilePhotoUrl) {
    const imageData = await imageUrlToDataUrl(options.profilePhotoUrl);
    if (imageData) {
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(pageWidth - 42, y - 2, 28, 28, 3, 3);
      doc.addImage(imageData, 'JPEG', pageWidth - 41, y - 1, 26, 26);
    }
  }

  // ─── Student Information ─────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Student Information', 14, y);
  y += 2;
  doc.setDrawColor(30, 41, 59);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  const studentInfo = [
    ['Full Name', student.name],
    ['Student Code', student.studentCode],
    ['IC Number', student.ic],
    ['Date of Birth', student.dateOfBirth.toLocaleDateString('en-MY', { day: '2-digit', month: 'long', year: 'numeric' })],
    ['Registration Date', student.registrationDate.toLocaleDateString('en-MY', { day: '2-digit', month: 'long', year: 'numeric' })],
    ['Status', student.status.toUpperCase()],
    ['Subsidy Category', student.subsidyCategory],
    ['Education Level', student.educationLevel.charAt(0).toUpperCase() + student.educationLevel.slice(1)],
  ];

  const colWidth = (pageWidth - 28) / 2;
  for (let i = 0; i < studentInfo.length; i += 2) {
    const left = studentInfo[i];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(left[0], 14, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(left[1], 14 + 40, y);

    if (i + 1 < studentInfo.length) {
      const right = studentInfo[i + 1];
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(right[0], 14 + colWidth, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(right[1], 14 + colWidth + 40, y);
    }
    y += 6;
  }

  y += 4;

  // ─── Guardian Information ────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Guardian Information', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setFontSize(9);
  const guardianInfo = [
    ['Guardian Name', student.guardian.name],
    ['IC Number', student.guardian.ic],
    ['Phone', student.guardian.phoneNumber ?? '-'],
    ['Email', student.guardian.email],
  ];

  for (let i = 0; i < guardianInfo.length; i += 2) {
    const left = guardianInfo[i];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(left[0], 14, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(left[1], 14 + 40, y);

    if (i + 1 < guardianInfo.length) {
      const right = guardianInfo[i + 1];
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(right[0], 14 + colWidth, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(right[1], 14 + colWidth + 40, y);
    }
    y += 6;
  }

  y += 4;

  // ─── Centre Information ──────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Centre / School Information', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setFontSize(9);
  const centreInfo = [
    ['Centre Name', student.centre.name],
    ['Centre Code', student.centre.code],
    ['Address', student.centre.address],
    ['Centre Head', student.centre.head.name],
  ];

  for (const [label, value] of centreInfo) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(value, 14 + 40, y);
    y += 6;
  }

  y += 4;

  // ─── Subsidy Information ─────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Subsidy Information', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setFontSize(9);
  const subsidyInfo = [
    ['Category', subsidy.subsidyCategory],
    ['Fund Source', subsidy.fundSource],
    ['Monthly Subsidy', `RM ${subsidy.monthlySubsidy.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`],
    ['Months Covered', `${subsidy.monthsCovered} months`],
    ['Total Credited', `RM ${subsidy.totalSubsidyCredited.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`],
  ];

  for (let i = 0; i < subsidyInfo.length; i += 2) {
    const left = subsidyInfo[i];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(left[0], 14, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(left[1], 14 + 40, y);

    if (i + 1 < subsidyInfo.length) {
      const right = subsidyInfo[i + 1];
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(right[0], 14 + colWidth, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(right[1], 14 + colWidth + 40, y);
    }
    y += 6;
  }

  y += 4;

  // ─── Attendance Summary ──────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Attendance Summary (Last 90 Days)', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Status', 'Days', 'Percentage']],
    body: [
      ['Present', String(attendance.presentCount), `${attendance.totalDays > 0 ? ((attendance.presentCount / attendance.totalDays) * 100).toFixed(1) : 0}%`],
      ['Late', String(attendance.lateCount), `${attendance.totalDays > 0 ? ((attendance.lateCount / attendance.totalDays) * 100).toFixed(1) : 0}%`],
      ['Absent', String(attendance.absentCount), `${attendance.totalDays > 0 ? ((attendance.absentCount / attendance.totalDays) * 100).toFixed(1) : 0}%`],
      ['Total', String(attendance.totalDays), `Rate: ${attendance.attendanceRate}%`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
    tableWidth: 'auto',
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 8;

  // ─── Fee Payment History ─────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Fee Payment History', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 4;

  const totalPaid = feeData.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = feeData.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

  autoTable(doc, {
    startY: y,
    head: [['Month', 'Amount (RM)', 'Status', 'Paid Date']],
    body: [
      ...feeData.map(f => [
        f.month,
        `RM ${f.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
        f.status.toUpperCase(),
        f.paidDate ? new Date(f.paidDate).toLocaleDateString('en-MY') : '-',
      ]),
      ['', '', '', ''],
      ['Total Paid', `RM ${totalPaid.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, 'Outstanding', `RM ${totalPending.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
    didParseCell(data) {
      // Style the summary row
      if (data.row.index === feeData.length + 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [241, 245, 249]; // slate-100
      }
      // Color code status column
      if (data.column.index === 2 && data.section === 'body' && data.row.index < feeData.length) {
        const status = data.cell.raw as string;
        if (status === 'PAID') {
          data.cell.styles.textColor = [22, 163, 74]; // green-600
        } else if (status === 'PENDING') {
          data.cell.styles.textColor = [234, 88, 12]; // orange-600
        }
      }
    },
  });

  y = (doc.lastAutoTable?.finalY ?? y) + 10;

  // ─── Health Summary ──────────────────────────────────────
  y = ensurePageSpace(doc, y, 46);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Health & Wellbeing Summary', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  const health = options.health ?? {};
  const healthInfo = [
    ['Blood Type', health.bloodType ?? 'Not Recorded'],
    ['Allergies', (health.allergies && health.allergies.length > 0) ? health.allergies.join(', ') : 'None'],
    ['Chronic Conditions', (health.chronicConditions && health.chronicConditions.length > 0) ? health.chronicConditions.join(', ') : 'None'],
    ['Last Screening', health.lastScreeningDate ?? 'Not Recorded'],
    ['Emergency Contact', health.emergencyContact ?? student.guardian.phoneNumber ?? '-'],
  ];

  doc.setFontSize(9);
  for (const [label, value] of healthInfo) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(value, 58, y);
    y += 6;
  }

  // ─── Curriculum / Academic Summary ───────────────────────
  y = ensurePageSpace(doc, y + 2, 62);
  y += 2;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Curriculum & Academic Summary', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 4;

  const curriculumRows = (options.curriculum && options.curriculum.length > 0
    ? options.curriculum
    : [
      { term: 'Term 1', subject: 'Core Learning', score: 78, grade: 'B+', remark: 'Consistent progress' },
      { term: 'Term 1', subject: 'Islamic Studies', score: 84, grade: 'A', remark: 'Strong understanding' },
      { term: 'Term 1', subject: 'Language', score: 74, grade: 'B+', remark: 'Needs vocabulary practice' },
      { term: 'Term 1', subject: 'Numeracy / Mathematics', score: 81, grade: 'A-', remark: 'Good problem solving' },
    ]);

  autoTable(doc, {
    startY: y,
    head: [['Term', 'Subject', 'Score', 'Grade', 'Remark']],
    body: curriculumRows.map((r) => [r.term, r.subject, String(r.score), r.grade, r.remark]),
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });
  y = (doc.lastAutoTable?.finalY ?? y) + 8;

  // ─── Comments & Recommendations ──────────────────────────
  y = ensurePageSpace(doc, y, 48);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Teacher / Warden Comments', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  const comments = options.comments && options.comments.length > 0
    ? options.comments
    : [
      'Student shows steady academic and behavioural development.',
      'Attendance is satisfactory; punctuality should continue to be monitored.',
      'Guardian engagement is good and responsive.',
    ];

  doc.setFontSize(9);
  comments.forEach((comment) => {
    const lines = doc.splitTextToSize(`• ${comment}`, pageWidth - 30);
    doc.setTextColor(45, 45, 45);
    doc.text(lines, 16, y);
    y += (lines.length * 4.5) + 1;
  });

  y = ensurePageSpace(doc, y + 2, 30);
  y += 2;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Recommendations', 14, y);
  y += 2;
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  const recommendations = options.recommendations && options.recommendations.length > 0
    ? options.recommendations
    : [
      'Continue monthly progress review with guardian.',
      'Maintain attendance above 90% and reduce late occurrences.',
      'Provide targeted support for lowest-performing subject area.',
    ];

  doc.setFontSize(9);
  recommendations.forEach((item) => {
    const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 30);
    doc.setTextColor(45, 45, 45);
    doc.text(lines, 16, y);
    y += (lines.length * 4.5) + 1;
  });

  // ─── AI Assessment ───────────────────────────────────────
  const ai = options.aiAssessment;
  if (ai) {
    y = ensurePageSpace(doc, y + 4, 52);
    y += 4;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('AI Assessment Summary', 14, y);
    y += 2;
    doc.line(14, y, pageWidth - 14, y);
    y += 6;

    doc.setFontSize(9);
    doc.setTextColor(45, 45, 45);
    const overviewLines = doc.splitTextToSize(ai.overview, pageWidth - 28);
    doc.text(overviewLines, 14, y);
    y += overviewLines.length * 4.5 + 3;

    if (typeof ai.confidence === 'number') {
      doc.setFont('helvetica', 'bold');
      doc.text(`Model Confidence: ${ai.confidence}%`, 14, y);
      y += 6;
    }

    const printList = (title: string, items: string[]) => {
      if (items.length === 0) return;
      y = ensurePageSpace(doc, y, 18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(title, 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(45, 45, 45);
      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 30);
        doc.text(lines, 16, y);
        y += lines.length * 4.2 + 1;
      });
      y += 1;
    };

    printList('Key Strengths', ai.strengths);
    printList('Observed Risks', ai.risks);
    printList('Recommended Next Actions', ai.nextActions);
  }

  // ─── Footer ──────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('This report is auto-generated by EduCentre Student Management Portal — MAIWP', 14, footerY);
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - 14, footerY, { align: 'right' });

  // ─── Save ────────────────────────────────────────────────
  const dateStr = now.toISOString().split('T')[0];
  doc.save(`Student_Report_${student.studentCode}_${dateStr}.pdf`);
}
