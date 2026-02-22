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
    <div className="px-4 py-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Exam Results</h1>
        <p className="text-xs text-gray-500">{child?.name ?? 'Student'} · {meta.yearLabel} {latestExam?.year ?? ''}</p>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Award className="h-10 w-10 mx-auto mb-2" />
          <p className="text-sm">No exam results available</p>
        </div>
      ) : (
        <>
          {/* Average Score Banner */}
          <div className={`rounded-xl p-4 text-center ${
            latestAvg >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            latestAvg >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
            'bg-gradient-to-r from-amber-500 to-orange-500'
          } text-white`}>
            <p className="text-3xl font-bold">{latestAvg.toFixed(1)}</p>
            <p className="text-sm opacity-90">Latest Average</p>
            {avgTrend !== null && (
              <div className={`flex items-center justify-center gap-1 mt-1 text-sm ${avgTrend >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {avgTrend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{avgTrend >= 0 ? '+' : ''}{avgTrend.toFixed(1)} from previous</span>
              </div>
            )}
          </div>

          {/* Latest Exam — Always Expanded */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Latest Result</p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{latestExam.examName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{latestExam.class} · {latestExam.examDate}</p>
              </div>
              <div className="p-3">
                <div className="space-y-2">
                  {latestExam.subjects.map((subj) => {
                    // Find same subject in previous exam for trend
                    const prevSubj = prevExam?.subjects.find(s => s.code === subj.code);
                    const markDiff = prevSubj ? subj.mark - prevSubj.mark : null;
                    return (
                      <div key={subj.code} className="flex items-center gap-2 px-1">
                        <span className="text-xs text-gray-500 w-8 shrink-0 font-mono">{subj.code}</span>
                        <span className="text-xs text-gray-700 flex-1 truncate">{subj.name}</span>
                        <span className="text-sm font-semibold text-gray-900 w-8 text-right">{subj.mark}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getGradeColor(subj.grade)}`}>
                          {subj.grade}
                        </span>
                        {markDiff !== null && (
                          <span className={`text-[10px] w-8 text-right ${markDiff > 0 ? 'text-green-600' : markDiff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {markDiff > 0 ? `+${markDiff}` : markDiff === 0 ? '—' : markDiff}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Past Exams — Collapsible */}
          {exams.length > 1 && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Past Exams</p>
              <div className="space-y-2">
                {exams.slice(1).map((exam, idx) => {
                  const avg = getAverage(exam.subjects);
                  const isExpanded = expandedIdx === idx;
                  // Get previous exam for this one (the exam after it in the array, since they're sorted newest first)
                  const olderExam = exams[idx + 2] ?? null;

                  return (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                        className="w-full p-4 flex items-center justify-between text-left active:bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{exam.examName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{exam.class} · Avg: {avg.toFixed(1)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            avg >= 80 ? 'bg-green-100 text-green-700' :
                            avg >= 60 ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {avg.toFixed(0)}
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-3 space-y-2">
                          {exam.subjects.map((subj) => {
                            const olderSubj = olderExam?.subjects.find(s => s.code === subj.code);
                            const markDiff = olderSubj ? subj.mark - olderSubj.mark : null;
                            return (
                              <div key={subj.code} className="flex items-center gap-2 px-1">
                                <span className="text-xs text-gray-500 w-8 shrink-0 font-mono">{subj.code}</span>
                                <span className="text-xs text-gray-700 flex-1 truncate">{subj.name}</span>
                                <span className="text-sm font-semibold text-gray-900 w-8 text-right">{subj.mark}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getGradeColor(subj.grade)}`}>
                                  {subj.grade}
                                </span>
                                {markDiff !== null && (
                                  <span className={`text-[10px] w-8 text-right ${markDiff > 0 ? 'text-green-600' : markDiff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {markDiff > 0 ? `+${markDiff}` : markDiff === 0 ? '—' : markDiff}
                                  </span>
                                )}
                              </div>
                            );
                          })}
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
  );
}
