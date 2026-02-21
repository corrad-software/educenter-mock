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

export function generateStudentPDF(
  student: MAIWPStudent,
  attendance: AttendanceSummary,
  feeData: FeeRecord[],
  subsidy: SubsidySummary,
) {
  const doc = new jsPDF();
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

  y = (doc as any).lastAutoTable.finalY + 8;

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

  y = (doc as any).lastAutoTable.finalY + 10;

  // ─── Footer ──────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('This report is auto-generated by EduCentre Student Management Portal — MAIWP', 14, footerY);
  doc.text(`Page 1 of 1`, pageWidth - 14, footerY, { align: 'right' });

  // ─── Save ────────────────────────────────────────────────
  const dateStr = now.toISOString().split('T')[0];
  doc.save(`Student_Report_${student.studentCode}_${dateStr}.pdf`);
}
