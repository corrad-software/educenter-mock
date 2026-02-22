'use client';

import { useRef } from 'react';
import { X, Download } from 'lucide-react';

interface PdfRow {
  label: string;
  value: string;
  bold?: boolean;
  color?: 'green' | 'red' | 'default';
}

interface PdfDocumentProps {
  title: string;
  subtitle: string;
  rows: PdfRow[];
  onClose: () => void;
}

export function PdfDocument({ title, subtitle, rows, onClose }: PdfDocumentProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${subtitle}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #111; }
            .header { text-align: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
            .header h1 { font-size: 14px; color: #6b7280; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
            .header h2 { font-size: 22px; font-weight: 700; }
            .header p { font-size: 12px; color: #9ca3af; margin-top: 4px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
            .row .label { color: #6b7280; }
            .row .value { font-weight: 500; text-align: right; }
            .row.bold .label, .row.bold .value { font-weight: 700; font-size: 16px; color: #111; }
            .row .green { color: #16a34a; }
            .row .red { color: #dc2626; }
            .divider { border-top: 1px solid #e5e7eb; margin: 4px 0; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EduCentre</h1>
            <h2>${title}</h2>
            <p>${subtitle}</p>
          </div>
          ${rows.map(r => {
            if (r.label === '---') return '<div class="divider"></div>';
            const colorClass = r.color === 'green' ? 'green' : r.color === 'red' ? 'red' : '';
            return `<div class="row ${r.bold ? 'bold' : ''}"><span class="label">${r.label}</span><span class="value ${colorClass}">${r.value}</span></div>`;
          }).join('')}
          <div class="footer">
            <p>EduCentre &middot; MAIWP Student Management Portal</p>
            <p>This is a computer-generated document. No signature required.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-h-[90vh] rounded-t-2xl sm:rounded-2xl sm:max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900">PDF Preview</p>
          <button onClick={onClose} className="p-1 rounded-lg active:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Document Preview */}
        <div className="flex-1 overflow-y-auto p-4">
          <div ref={printRef} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            {/* Document Header */}
            <div className="text-center mb-5 pb-4 border-b border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">EduCentre</p>
              <p className="text-base font-bold text-gray-900">{title}</p>
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            </div>

            {/* Document Rows */}
            <div className="space-y-0">
              {rows.map((row, i) => {
                if (row.label === '---') {
                  return <hr key={i} className="my-2 border-gray-200" />;
                }
                const colorClass =
                  row.color === 'green' ? 'text-green-600' :
                  row.color === 'red' ? 'text-red-600' : 'text-gray-900';
                return (
                  <div key={i} className={`flex justify-between py-1.5 text-sm ${row.bold ? 'font-bold text-base' : ''}`}>
                    <span className="text-gray-500">{row.label}</span>
                    <span className={`text-right ${row.bold ? colorClass : colorClass} ${!row.bold && !row.color ? 'font-medium text-gray-900' : ''}`}>
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-gray-200 text-center">
              <p className="text-[10px] text-gray-400">EduCentre · MAIWP Student Management Portal</p>
              <p className="text-[10px] text-gray-400">Computer-generated document. No signature required.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
