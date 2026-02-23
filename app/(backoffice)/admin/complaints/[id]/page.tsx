import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { complaintRecords, complaintTimeline } from '@/lib/mock-data/complaints';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const complaint = complaintRecords.find((entry) => entry.id === id);

  if (!complaint) {
    notFound();
  }

  const timeline = complaintTimeline
    .filter((entry) => entry.complaintId === complaint.id)
    .sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href="/admin/complaints" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to complaints
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{complaint.referenceNo}</h1>
          <p className="text-muted-foreground">{complaint.subject}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardDescription>Status</CardDescription><CardTitle className="capitalize">{complaint.status}</CardTitle></CardHeader>
          <CardContent><Badge variant="outline" className="capitalize">{complaint.priority} priority</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Assigned To</CardDescription><CardTitle className="text-base">{complaint.assignedTo}</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Due {format(complaint.dueAt, 'dd MMM yyyy')}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardDescription>Submitted By</CardDescription><CardTitle className="text-base">{complaint.submittedBy}</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground capitalize">Via {complaint.channel.replace('_', ' ')}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium">Student:</span> {complaint.studentName}</p>
          <p><span className="font-medium">Centre:</span> {complaint.centreName}</p>
          <p><span className="font-medium">Category:</span> <span className="capitalize">{complaint.category}</span></p>
          <p className="pt-2"><span className="font-medium">Description:</span></p>
          <p className="text-muted-foreground">{complaint.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Activity history for this complaint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {timeline.length === 0 && <p className="text-sm text-muted-foreground">No timeline activity yet.</p>}
          {timeline.map((entry) => (
            <div key={entry.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-sm">{entry.action}</p>
                <p className="text-xs text-muted-foreground">{format(entry.at, 'dd MMM yyyy, hh:mm a')}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">By {entry.actor}</p>
              <p className="text-sm mt-2">{entry.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
