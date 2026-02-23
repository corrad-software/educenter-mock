import Link from 'next/link';
import { Award, CalendarDays, Users } from 'lucide-react';
import { cocurricularActivities, cocurricularParticipation } from '@/lib/mock-data/cocurricular';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CocurricularOverviewPage() {
  const totalActivities = cocurricularActivities.length;
  const activeActivities = cocurricularActivities.filter((a) => a.status === 'active').length;
  const activeParticipants = cocurricularParticipation.filter((p) => p.status === 'active').length;
  const averageAttendance = Math.round(
    cocurricularParticipation.reduce((sum, p) => sum + p.attendanceRate, 0) / cocurricularParticipation.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Co-Curricular Overview</h1>
          <p className="text-muted-foreground">Monitor activities, participation, and outcomes across centres.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/cocurricular/activities"><Button variant="outline">Activities</Button></Link>
          <Link href="/admin/cocurricular/participation"><Button variant="outline">Participation</Button></Link>
          <Link href="/admin/cocurricular/outcomes"><Button>Outcomes</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardDescription>Total Activities</CardDescription><CardTitle>{totalActivities}</CardTitle></CardHeader><CardContent><CalendarDays className="h-4 w-4 text-muted-foreground" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Active Activities</CardDescription><CardTitle>{activeActivities}</CardTitle></CardHeader><CardContent><Badge className="bg-green-500">Live</Badge></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Active Participants</CardDescription><CardTitle>{activeParticipants}</CardTitle></CardHeader><CardContent><Users className="h-4 w-4 text-blue-600" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Avg Attendance</CardDescription><CardTitle>{averageAttendance}%</CardTitle></CardHeader><CardContent><Award className="h-4 w-4 text-amber-600" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Activity Snapshot</CardTitle>
          <CardDescription>Quick status by activity type and utilization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {cocurricularActivities.map((activity) => {
            const utilization = Math.round((activity.activeParticipants / activity.maxParticipants) * 100);
            return (
              <div key={activity.id} className="rounded-md border p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.centreName} • {activity.schedule}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                    <Badge className={activity.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}>{activity.status}</Badge>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(utilization, 100)}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{activity.activeParticipants}/{activity.maxParticipants} participants ({utilization}% utilization)</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
