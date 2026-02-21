'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingUp, Users } from 'lucide-react';
import { useEducationStore } from '@/lib/store/education-store';
import { LEVEL_META, LEVEL_SCORING, LEVEL_COLOR_CLASSES } from '@/lib/education-config';
import {
  PRESCHOOL_STUDENTS,
  PRIMARY_STUDENTS,
  SECONDARY_STUDENTS,
  UNIVERSITY_STUDENTS,
} from '@/lib/mock-data/level-data';

export default function ScoringPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';
  const meta = LEVEL_META[level];
  const scoring = LEVEL_SCORING[level];
  const colors = LEVEL_COLOR_CLASSES[level];

  const pageTitle =
    level === 'university' ? 'CGPA & Transcripts' :
    level === 'preschool' ? 'Development Band Results' :
    level === 'secondary' ? 'GPA & Grade Results' :
    'Grades & Results';

  // ---- PRESCHOOL VIEW ----
  if (level === 'preschool') {
    const bandCounts: Record<string, number> = { Exceeding: 0, Achieving: 0, Developing: 0, Emerging: 0 };
    PRESCHOOL_STUDENTS.forEach(student => {
      Object.values(student.scores).forEach(band => {
        if (band in bandCounts) bandCounts[band]++;
      });
    });
    const totalScores = Object.values(bandCounts).reduce((a, b) => a + b, 0);

    const bandColors: Record<string, string> = {
      Exceeding: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      Achieving: 'bg-blue-100 border-blue-300 text-blue-800',
      Developing: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      Emerging: 'bg-red-100 border-red-300 text-red-800',
    };
    const bandBarColors: Record<string, string> = {
      Exceeding: '#10b981',
      Achieving: '#3b82f6',
      Developing: '#f59e0b',
      Emerging: '#ef4444',
    };

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
            <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
          </div>
          <p className="text-muted-foreground">Holistic development band assessment results</p>
        </div>

        {/* Band Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Exceeding', 'Achieving', 'Developing', 'Emerging'].map(band => (
            <Card key={band} className={`border-2 ${bandColors[band]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{band}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bandCounts[band]}</div>
                <p className="text-xs mt-1 opacity-70">
                  {totalScores > 0 ? Math.round((bandCounts[band] / totalScores) * 100) : 0}% of scores
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-white/50">
                  <div
                    className="h-1.5 rounded-full bg-current opacity-60"
                    style={{ width: `${totalScores > 0 ? (bandCounts[band] / totalScores) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Per-student bands */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Development Report</CardTitle>
            <CardDescription>Current term band results per child</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Child</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Literacy</TableHead>
                  <TableHead>Numeracy</TableHead>
                  <TableHead>Arts</TableHead>
                  <TableHead>Islamic Ed</TableHead>
                  <TableHead>PE</TableHead>
                  <TableHead>Social</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRESCHOOL_STUDENTS.map(student => {
                  const getBandBadge = (band: string) => {
                    const bandMap: Record<string, string> = {
                      Exceeding: 'bg-emerald-100 text-emerald-800',
                      Achieving: 'bg-blue-100 text-blue-800',
                      Developing: 'bg-yellow-100 text-yellow-800',
                      Emerging: 'bg-red-100 text-red-800',
                    };
                    return <Badge className={`${bandMap[band] ?? ''} text-xs border-0`}>{band.slice(0, 3)}</Badge>;
                  };
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.age} yrs</TableCell>
                      <TableCell className="capitalize">{student.session}</TableCell>
                      <TableCell>{getBandBadge(student.scores.LIT)}</TableCell>
                      <TableCell>{getBandBadge(student.scores.NUM)}</TableCell>
                      <TableCell>{getBandBadge(student.scores.ART)}</TableCell>
                      <TableCell>{getBandBadge(student.scores.REL)}</TableCell>
                      <TableCell>{getBandBadge(student.scores.PE)}</TableCell>
                      <TableCell>{getBandBadge(student.scores.SEL)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Band Distribution Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={Object.entries(bandCounts).map(([band, count]) => ({ band, count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="band" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Count">
                  {Object.keys(bandCounts).map((band) => (
                    <rect key={band} fill={bandBarColors[band]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- UNIVERSITY VIEW ----
  if (level === 'university') {
    const avgCgpa = UNIVERSITY_STUDENTS.reduce((sum, s) => sum + s.cgpa, 0) / UNIVERSITY_STUDENTS.length;
    const probationCount = UNIVERSITY_STUDENTS.filter(s => s.cgpa < 2.00).length;
    const honourCount = UNIVERSITY_STUDENTS.filter(s => s.cgpa >= 3.50).length;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
            <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
          </div>
          <p className="text-muted-foreground">Semester academic performance and CGPA records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
              <TrendingUp className={`h-4 w-4 ${colors.text}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCgpa.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across {UNIVERSITY_STUDENTS.length} students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dean&apos;s List</CardTitle>
              <Award className={`h-4 w-4 ${colors.text}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{honourCount}</div>
              <p className="text-xs text-muted-foreground">CGPA ≥ 3.50</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Academic Probation</CardTitle>
              <Users className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{probationCount}</div>
              <p className="text-xs text-muted-foreground">CGPA &lt; 2.00</p>
            </CardContent>
          </Card>
        </div>

        {UNIVERSITY_STUDENTS.map(student => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{student.name}</CardTitle>
                  <CardDescription>{student.programme} · {student.semester}</CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${student.cgpa >= 3.5 ? 'text-emerald-600' : student.cgpa < 2.0 ? 'text-red-600' : colors.text}`}>
                    {student.cgpa.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">CGPA · {student.creditHoursEnrolled} credit hrs</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module Code</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">GPA Points</TableHead>
                    <TableHead className="text-right">Credit Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.modules.map(mod => {
                    const gradeEntry = scoring.scale.find(s => s.value === mod.grade);
                    return (
                      <TableRow key={mod.code}>
                        <TableCell className="font-mono text-sm">{mod.code}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs border-0 ${gradeEntry?.colorClass ?? ''}`}>{mod.grade}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{mod.gpa.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{mod.creditHours}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ---- PRIMARY / SECONDARY VIEW ----
  const students = level === 'primary' ? PRIMARY_STUDENTS : SECONDARY_STUDENTS;

  const gradeCounts: Record<string, number> = {};
  scoring.scale.forEach(s => { gradeCounts[s.value] = 0; });
  students.forEach(student => {
    Object.values(student.scores).forEach(score => {
      if (score.grade in gradeCounts) gradeCounts[score.grade]++;
    });
  });

  const gradeChartData = scoring.scale
    .filter(s => gradeCounts[s.value] > 0)
    .map(s => ({ grade: s.value, count: gradeCounts[s.value] }));

  const avgGpa = level === 'secondary'
    ? (() => {
        let totalPoints = 0, totalSubjects = 0;
        SECONDARY_STUDENTS.forEach(s => {
          Object.values(s.scores).forEach(score => {
            if (score.gpa !== undefined) { totalPoints += score.gpa; totalSubjects++; }
          });
        });
        return totalSubjects > 0 ? (totalPoints / totalSubjects).toFixed(2) : '0.00';
      })()
    : null;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
        </div>
        <p className="text-muted-foreground">
          {level === 'secondary' ? 'SPM-track GPA grades and results' : 'KSSR grade results for current term'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Assessed</CardTitle>
            <Users className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
        {level === 'secondary' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
              <TrendingUp className={`h-4 w-4 ${colors.text}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgGpa}</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scoring System</CardTitle>
            <Award className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{scoring.label}</div>
            <p className="text-xs text-muted-foreground">{scoring.scale.length} grade levels</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Number of subject scores per grade across all students</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={gradeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill={level === 'secondary' ? '#7c3aed' : '#3b82f6'} name="Scores" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Per-student table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grade Report</CardTitle>
          <CardDescription>Subject-by-subject results for sampled students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {students.map(student => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {level === 'primary' ? `Year ${student.year}` : `Form ${student.form}`} · {student.class}
                    </p>
                  </div>
                  {level === 'secondary' && (() => {
                    const scores = Object.values(student.scores);
                    const gpaValues = scores.map(s => s.gpa).filter(g => g !== undefined) as number[];
                    const avg = gpaValues.length > 0 ? (gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length).toFixed(2) : '—';
                    return (
                      <Badge className={`${colors.bg} text-white`}>GPA {avg}</Badge>
                    );
                  })()}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(student.scores).map(([code, score]) => {
                    const gradeEntry = scoring.scale.find(s => s.value === score.grade);
                    return (
                      <div key={code} className={`px-2.5 py-1.5 rounded-md border text-xs ${gradeEntry?.colorClass ?? 'bg-gray-50'}`}>
                        <span className="font-mono font-semibold">{code}</span>
                        <span className="mx-1 opacity-40">|</span>
                        <span className="font-bold">{score.grade}</span>
                        <span className="ml-1 opacity-60">({score.mark})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
