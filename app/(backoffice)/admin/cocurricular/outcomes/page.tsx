import { Trophy } from 'lucide-react';
import { cocurricularParticipation } from '@/lib/mock-data/cocurricular';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CocurricularOutcomesPage() {
  const ranking = [...cocurricularParticipation].sort((a, b) => b.meritPoints - a.meritPoints);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Outcome Summary</h1>
        <p className="text-muted-foreground">Merit and achievement outcomes from co-curricular participation.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Participants</CardTitle>
          <CardDescription>Ranking by merit points and supporting achievements.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ranking.map((entry, idx) => (
            <div key={entry.id} className="rounded-md border p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">#{idx + 1} {entry.studentName}</p>
                <p className="text-sm text-muted-foreground">{entry.activityName}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm">Attendance {entry.attendanceRate}%</p>
                <p className="text-sm font-semibold">{entry.meritPoints} points</p>
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
