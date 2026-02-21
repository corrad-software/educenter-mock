'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Clock, Users } from 'lucide-react';
import { useEducationStore } from '@/lib/store/education-store';
import { LEVEL_META, LEVEL_SUBJECTS, LEVEL_COLOR_CLASSES, LEVEL_SCORING } from '@/lib/education-config';

export default function SubjectsPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';
  const meta = LEVEL_META[level];
  const colors = LEVEL_COLOR_CLASSES[level];
  const subjects = LEVEL_SUBJECTS[level];
  const scoring = LEVEL_SCORING[level];

  const coreCount = subjects.filter(s => s.isCore).length;
  const electiveCount = subjects.filter(s => !s.isCore).length;
  const totalCreditHours = subjects.reduce((sum, s) => sum + (s.creditHours ?? 0), 0);

  const pageTitle =
    level === 'university' ? 'Modules / Courses' :
    level === 'preschool' ? 'Activities & Learning Areas' :
    `Subjects (${level === 'primary' ? 'KSSR' : 'SPM'})`;

  const pageDescription =
    level === 'university' ? 'Credit-hour based modules for the current semester' :
    level === 'preschool' ? 'Holistic development areas for early childhood education' :
    `Core and elective subjects for ${meta.label}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
        </div>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total {level === 'university' ? 'Modules' : level === 'preschool' ? 'Areas' : 'Subjects'}</CardTitle>
            <BookOpen className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">{coreCount} core · {electiveCount} elective</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {level === 'university' ? 'Total Credit Hours' : 'Scoring System'}
            </CardTitle>
            <Clock className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {level === 'university' ? totalCreditHours : scoring.label}
            </div>
            <p className="text-xs text-muted-foreground">
              {level === 'university' ? 'Per full semester' : `${scoring.scale.length} grade levels`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Education Level</CardTitle>
            <Users className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.ageRange}</div>
            <p className="text-xs text-muted-foreground">{meta.label}</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Table */}
      <Card>
        <CardHeader>
          <CardTitle>{level === 'university' ? 'Module List' : level === 'preschool' ? 'Learning Areas' : 'Subject List'}</CardTitle>
          <CardDescription>
            {level === 'preschool'
              ? 'All developmental learning areas for this level'
              : `All ${level === 'university' ? 'modules' : 'subjects'} offered at ${meta.label}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>{level === 'university' ? 'Module Name' : 'Subject Name'}</TableHead>
                {(level === 'primary' || level === 'secondary') && (
                  <TableHead>Malay Name</TableHead>
                )}
                <TableHead>Type</TableHead>
                {level === 'university' && (
                  <TableHead className="text-right">Credit Hours</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.code}>
                  <TableCell className="font-mono font-semibold text-gray-500">{subject.code}</TableCell>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  {(level === 'primary' || level === 'secondary') && (
                    <TableCell className="text-gray-500 text-sm">{subject.nameMs ?? subject.name}</TableCell>
                  )}
                  <TableCell>
                    {subject.isCore ? (
                      <Badge className={`${colors.bg} text-white text-xs`}>Core</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-gray-500">Elective</Badge>
                    )}
                  </TableCell>
                  {level === 'university' && (
                    <TableCell className="text-right font-semibold">{subject.creditHours} hrs</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scoring Reference */}
      <Card>
        <CardHeader>
          <CardTitle>{scoring.label} — Grade Reference</CardTitle>
          <CardDescription>Grading scale used for this education level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {scoring.scale.map((grade) => (
              <div
                key={grade.value}
                className={`px-3 py-2 rounded-lg border text-sm font-medium ${grade.colorClass}`}
              >
                <span className="font-bold">{grade.label}</span>
                {grade.minMark !== undefined && (
                  <span className="ml-1 text-xs opacity-70">{grade.minMark}–{grade.maxMark ?? 100}</span>
                )}
                {grade.gpaPoints !== undefined && scoring.type === 'gpa' && (
                  <span className="ml-1 text-xs opacity-70">({grade.gpaPoints.toFixed(2)})</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
