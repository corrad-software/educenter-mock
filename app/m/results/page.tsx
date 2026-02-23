'use client';

import { useState, useMemo } from 'react';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { Award, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';

type ExamEntry = {
  year: number;
  semester: number;
  examName: string;
  examDate: string;
  class: string;
  subjects: { code: string; name: string; mark: number; grade: string }[];
};

const CHILD_META: Record<string, { level: string; yearLabel: string }> = {
  '1': { level: 'Primary', yearLabel: 'Year' },
  '3': { level: 'Secondary', yearLabel: 'Form' },
  '4': { level: 'University', yearLabel: 'Semester' },
};

const allExamResults: Record<string, ExamEntry[]> = {
  '1': [
    {
      year: 5, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2024-05', class: '5 Cemerlang',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 82, grade: 'A' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 71, grade: 'B+' },
        { code: 'MT', name: 'Matematik', mark: 88, grade: 'A' },
        { code: 'SC', name: 'Sains', mark: 79, grade: 'B+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 91, grade: 'A+' },
        { code: 'SE', name: 'Sejarah', mark: 74, grade: 'B+' },
      ],
    },
    {
      year: 4, semester: 2, examName: 'Peperiksaan Akhir Tahun', examDate: '2023-11', class: '4 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 78, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 68, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 85, grade: 'A' },
        { code: 'SC', name: 'Sains', mark: 76, grade: 'B+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 88, grade: 'A' },
        { code: 'SE', name: 'Sejarah', mark: 70, grade: 'B+' },
      ],
    },
    {
      year: 4, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2023-05', class: '4 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 75, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 62, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 80, grade: 'A' },
        { code: 'SC', name: 'Sains', mark: 72, grade: 'B+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 85, grade: 'A' },
        { code: 'SE', name: 'Sejarah', mark: 65, grade: 'B' },
      ],
    },
    {
      year: 3, semester: 2, examName: 'Peperiksaan Akhir Tahun', examDate: '2022-11', class: '3 Amanah',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 70, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 58, grade: 'C+' },
        { code: 'MT', name: 'Matematik', mark: 77, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 68, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 82, grade: 'A' },
        { code: 'SE', name: 'Sejarah', mark: 60, grade: 'B' },
      ],
    },
    {
      year: 3, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2022-05', class: '3 Amanah',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 65, grade: 'B' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 55, grade: 'C+' },
        { code: 'MT', name: 'Matematik', mark: 72, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 64, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 78, grade: 'B+' },
        { code: 'SE', name: 'Sejarah', mark: 58, grade: 'C+' },
      ],
    },
  ],
  '3': [
    {
      year: 2, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2024-05', class: '2 Cendekia',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 70, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 65, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 78, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 72, grade: 'B+' },
        { code: 'SE', name: 'Sejarah', mark: 68, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 85, grade: 'A' },
        { code: 'GE', name: 'Geografi', mark: 66, grade: 'B' },
      ],
    },
    {
      year: 1, semester: 2, examName: 'Peperiksaan Akhir Tahun', examDate: '2023-11', class: '1 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 65, grade: 'B' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 60, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 72, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 68, grade: 'B' },
        { code: 'SE', name: 'Sejarah', mark: 62, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 80, grade: 'A' },
        { code: 'GE', name: 'Geografi', mark: 60, grade: 'B' },
      ],
    },
    {
      year: 1, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2023-05', class: '1 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 60, grade: 'B' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 55, grade: 'C+' },
        { code: 'MT', name: 'Matematik', mark: 68, grade: 'B' },
        { code: 'SC', name: 'Sains', mark: 64, grade: 'B' },
        { code: 'SE', name: 'Sejarah', mark: 58, grade: 'C+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 76, grade: 'B+' },
        { code: 'GE', name: 'Geografi', mark: 56, grade: 'C+' },
      ],
    },
  ],
  '4': [
    {
      year: 3, semester: 1, examName: 'Peperiksaan Akhir Semester', examDate: '2024-05', class: 'Diploma Pengajian Islam',
      subjects: [
        { code: 'DPI301', name: 'Islamic Finance', mark: 78, grade: 'B+' },
        { code: 'DPI302', name: 'Business Management', mark: 85, grade: 'A' },
        { code: 'DPI303', name: 'Computer Applications', mark: 72, grade: 'B+' },
        { code: 'DPI304', name: 'Arabic Language III', mark: 80, grade: 'A' },
        { code: 'DPI305', name: 'Statistics', mark: 68, grade: 'B' },
      ],
    },
    {
      year: 2, semester: 1, examName: 'Peperiksaan Akhir Semester', examDate: '2023-11', class: 'Diploma Pengajian Islam',
      subjects: [
        { code: 'DPI201', name: 'Fiqh Muamalat', mark: 75, grade: 'B+' },
        { code: 'DPI202', name: 'Islamic History', mark: 82, grade: 'A' },
        { code: 'DPI203', name: 'English II', mark: 65, grade: 'B' },
        { code: 'DPI204', name: 'Fundamentals of Accounting', mark: 70, grade: 'B+' },
        { code: 'DPI205', name: 'Arabic Language II', mark: 76, grade: 'B+' },
      ],
    },
    {
      year: 1, semester: 1, examName: 'Peperiksaan Akhir Semester', examDate: '2023-05', class: 'Diploma Pengajian Islam',
      subjects: [
        { code: 'DPI101', name: 'Introduction to Islamic Studies', mark: 80, grade: 'A' },
        { code: 'DPI102', name: 'Arabic Language I', mark: 72, grade: 'B+' },
        { code: 'DPI103', name: 'English I', mark: 60, grade: 'B' },
        { code: 'DPI104', name: 'Basic Mathematics', mark: 75, grade: 'B+' },
        { code: 'DPI105', name: 'Malaysian Studies', mark: 78, grade: 'B+' },
      ],
    },
  ],
};

function getGradeColor(grade: string) {
  if (grade === 'A+') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (grade === 'A') return 'bg-green-100 text-green-700 border-green-200';
  if (grade === 'B+') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (grade === 'B') return 'bg-sky-100 text-sky-700 border-sky-200';
  if (grade === 'C+') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (grade === 'C') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

function getAverage(subjects: { mark: number }[]) {
  return subjects.reduce((sum, s) => sum + s.mark, 0) / subjects.length;
}

export default function MobileResultsPage() {
  const { selectedChildId } = useParentMobileStore();
  const child = guardianChildren.find(c => c.id === selectedChildId);
  const meta = CHILD_META[selectedChildId] ?? { level: 'Student', yearLabel: 'Year' };
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const exams = useMemo(
    () => allExamResults[selectedChildId] ?? [],
    [selectedChildId]
  );

  const latestExam = exams[0];
  const latestAvg = latestExam ? getAverage(latestExam.subjects) : 0;

  // Find previous exam for trend comparison
  const prevExam = exams.length > 1 ? exams[1] : null;
  const prevAvg = prevExam ? getAverage(prevExam.subjects) : null;
  const avgTrend = prevAvg !== null ? latestAvg - prevAvg : null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-md pt-5 pb-3 px-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-b border-gray-200/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 leading-none mb-1">Exam Results</h1>
        <p className="text-[14px] text-slate-500 font-medium">{child?.name ?? 'Student'} · {meta.yearLabel} {latestExam?.year ?? ''}</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-5">

        {exams.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Award className="h-10 w-10 mx-auto mb-2" />
            <p className="text-sm">No exam results available</p>
          </div>
        ) : (
          <>
            {/* Average Score Banner */}
            <div className={`rounded-3xl p-5 text-center shadow-lg shadow-black/5 relative overflow-hidden ${latestAvg >= 80 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
              latestAvg >= 60 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                'bg-gradient-to-br from-amber-500 to-orange-500'
              } text-white`}>
              {/* decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

              <div className="relative z-10">
                <p className="text-[40px] font-black tracking-tight leading-none mb-1">{latestAvg.toFixed(1)}</p>
                <p className="text-[12px] font-bold tracking-widest uppercase opacity-90">Latest Average</p>
                {avgTrend !== null && (
                  <div className={`inline-flex items-center justify-center gap-1 mt-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/10 backdrop-blur-sm ${avgTrend >= 0 ? 'text-green-50' : 'text-red-50'}`}>
                    {avgTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{avgTrend >= 0 ? '+' : ''}{avgTrend.toFixed(1)} from previous</span>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Exam — Always Expanded */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 tracking-tight mb-3 px-1">Latest Result</h3>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-gray-100">
                  <p className="text-[15px] font-bold text-slate-900">{latestExam.examName}</p>
                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">{latestExam.class} · {latestExam.examDate}</p>
                </div>
                <div className="p-2">
                  <div className="space-y-1">
                    {latestExam.subjects.map((subj) => {
                      const prevSubj = prevExam?.subjects.find(s => s.code === subj.code);
                      const markDiff = prevSubj ? subj.mark - prevSubj.mark : null;
                      return (
                        <div key={subj.code} className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-slate-500 tracking-widest">{subj.code.substring(0, 3)}</span>
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <span className="text-[14px] font-bold text-slate-800 block truncate">{subj.name}</span>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[16px] font-black text-slate-900">{subj.mark}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${getGradeColor(subj.grade)}`}>
                                {subj.grade}
                              </span>
                            </div>
                            {markDiff !== null && (
                              <span className={`text-[10px] font-bold mt-0.5 ${markDiff > 0 ? 'text-green-600' : markDiff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                {markDiff > 0 ? `+${markDiff}` : markDiff === 0 ? '—' : markDiff}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Past Exams — Collapsible */}
            {exams.length > 1 && (
              <div className="pb-8">
                <h3 className="text-[13px] font-bold text-slate-800 tracking-tight mb-3 px-1">Past Exams</h3>
                <div className="space-y-3">
                  {exams.slice(1).map((exam, idx) => {
                    const avg = getAverage(exam.subjects);
                    const isExpanded = expandedIdx === idx;
                    const olderExam = exams[idx + 2] ?? null;

                    return (
                      <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                        <button
                          onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                          className="w-full p-4 flex items-center justify-between text-left active:bg-slate-50 no-tap-highlight"
                        >
                          <div>
                            <p className="text-[15px] font-bold text-slate-900">{exam.examName}</p>
                            <p className="text-[12px] font-medium text-slate-500 mt-0.5">{exam.class} · Avg: {avg.toFixed(1)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[12px] font-black tracking-tight px-2.5 py-1 rounded-lg ${avg >= 80 ? 'bg-green-100 text-green-700' :
                              avg >= 60 ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                              {avg.toFixed(0)}
                            </span>
                            <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-100 p-2 bg-slate-50/30">
                            <div className="space-y-1">
                              {exam.subjects.map((subj) => {
                                const olderSubj = olderExam?.subjects.find(s => s.code === subj.code);
                                const markDiff = olderSubj ? subj.mark - olderSubj.mark : null;
                                return (
                                  <div key={subj.code} className="flex items-center gap-2 p-2 rounded-xl">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                      <span className="text-[10px] font-black text-slate-500 tracking-widest">{subj.code.substring(0, 3)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                      <span className="text-[14px] font-bold text-slate-800 block truncate">{subj.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                      <div className="flex items-baseline gap-1.5">
                                        <span className="text-[16px] font-black text-slate-900">{subj.mark}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${getGradeColor(subj.grade)}`}>
                                          {subj.grade}
                                        </span>
                                      </div>
                                      {markDiff !== null && (
                                        <span className={`text-[10px] font-bold mt-0.5 ${markDiff > 0 ? 'text-green-600' : markDiff < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                          {markDiff > 0 ? `+${markDiff}` : markDiff === 0 ? '—' : markDiff}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
