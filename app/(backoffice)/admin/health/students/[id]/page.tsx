import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { healthProfiles, healthIncidents, vaccinationRecords } from '@/lib/mock-data/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function StudentHealthDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = healthProfiles.find((item) => item.studentId === id);

  if (!profile) {
    notFound();
  }

  const incidents = healthIncidents.filter((item) => item.studentId === id);
  const vaccinations = vaccinationRecords.filter((item) => item.studentId === id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-3">
        <Link href="/admin/health" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to health overview
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{profile.studentName}</h1>
          <p className="text-muted-foreground">Medical profile and care history.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium">Blood Type:</span> {profile.bloodType}</p>
          <p><span className="font-medium">Allergies:</span> {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}</p>
          <p><span className="font-medium">Chronic Conditions:</span> {profile.chronicConditions.length > 0 ? profile.chronicConditions.join(', ') : 'None'}</p>
          <p><span className="font-medium">Emergency Contact:</span> {profile.emergencyContact}</p>
          <p><span className="font-medium">Last Screening:</span> {profile.lastScreeningDate}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Most recent health incidents for this student.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {incidents.length === 0 && <p className="text-sm text-muted-foreground">No incidents recorded.</p>}
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium capitalize">{incident.incidentType}</p>
                <Badge className={incident.severity === 'high' ? 'bg-red-600' : incident.severity === 'medium' ? 'bg-amber-600' : 'bg-blue-600'}>
                  {incident.severity}
                </Badge>
              </div>
              <p className="mt-2 text-sm">{incident.notes}</p>
              <p className="text-xs text-muted-foreground mt-1">Action: {incident.actionTaken}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vaccination Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {vaccinations.length === 0 && <p className="text-sm text-muted-foreground">No vaccination records available.</p>}
          {vaccinations.map((record) => (
            <div key={record.id} className="rounded-md border p-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{record.vaccine} • {record.dose}</p>
                <p className="text-xs text-muted-foreground">Due date: {record.dueDate}</p>
              </div>
              <Badge className={record.status === 'up_to_date' ? 'bg-green-600' : record.status === 'due_soon' ? 'bg-amber-600' : 'bg-red-600'}>
                {record.status.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
