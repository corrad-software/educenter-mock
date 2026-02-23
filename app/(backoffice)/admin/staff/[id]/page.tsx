'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { malaysianStaff } from '@/lib/mock-data/malaysian-staff';
import { ArrowLeft, Mail, Phone, Building2, Calendar, DollarSign, BookOpen, Baby, Info } from 'lucide-react';
import Link from 'next/link';

export default function StaffDetailPage() {
  const params = useParams();
  const staff = malaysianStaff.find(s => s.id === params.id);

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-2">Staff Not Found</h2>
        <p className="text-muted-foreground mb-4">The staff member you are looking for does not exist.</p>
        <Link href="/admin/staff">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Staff List
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'on_leave': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'resigned': return 'bg-red-100 text-red-700 border-red-300';
      case 'contract': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatStatus = (status: string) => {
    if (status === 'on_leave') return 'On Leave';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const aiAssessment = {
    overview: `${staff.name} (${formatRole(staff.role)}) is currently in a ${staff.status === 'active' ? 'stable' : 'watch'} readiness state for ${staff.centreCode}.`,
    confidence: staff.status === 'active' ? 90 : staff.status === 'on_leave' ? 78 : 74,
    strengths: [
      `Qualified in: ${staff.qualification}.`,
      `Assigned clearly to ${staff.centreName} (${staff.centreCode}).`,
      staff.subjectsTaught && staff.subjectsTaught.length > 0 ? `Covers ${staff.subjectsTaught.length} subject area(s).` : 'Role scope is defined in operations profile.',
    ],
    risks: [
      staff.status === 'on_leave' ? 'Current leave status may affect schedule continuity.' : 'No immediate attendance risk flag at profile level.',
      staff.hasChildEnrolled ? 'Payroll deduction dependency may require accurate monthly reconciliation.' : 'No payroll deduction dependency risk detected.',
      'Potential single-point dependency if role coverage backup is limited.',
    ],
    actions: [
      'Maintain quarterly competency and workload review.',
      'Ensure backup assignment is documented for critical duties.',
      'Track attendance/performance KPI in monthly staff operations meeting.',
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/staff">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{staff.name}</h1>
            <Badge variant="outline" className={getStatusColor(staff.status)}>
              {formatStatus(staff.status)}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono">{staff.employeeCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{staff.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IC Number</p>
                <p className="font-medium font-mono">{staff.ic}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{staff.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{staff.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline" className="mt-1">{formatRole(staff.role)}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Education Level</p>
                <Badge variant="outline" className="mt-1 capitalize">{staff.educationLevel}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Centre</p>
                  <p className="font-medium text-sm">{staff.centreName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{staff.centreCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{staff.joinDate}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Qualification</p>
                <p className="font-medium text-sm">{staff.qualification}</p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Salary</p>
                  <p className="font-medium">RM {staff.monthlySalary.toLocaleString('en-MY')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Assignments */}
        {staff.subjectsTaught && staff.subjectsTaught.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Teaching Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {staff.subjectsTaught.map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-sm">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Staff Children & Payroll Deduction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Payroll Deduction Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staff.hasChildEnrolled ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg font-bold">&#10003;</span>
                </div>
                <div>
                  <p className="font-medium text-green-800">Eligible for Payroll Deduction</p>
                  <p className="text-sm text-green-600">This staff member has a child enrolled in a MAIWP institution. Fee payments can be deducted from monthly salary.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-lg font-bold">&mdash;</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Not Applicable</p>
                  <p className="text-sm text-gray-500">No children currently enrolled in MAIWP institutions.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            AI Staff Assessment
            <Tooltip label="Rationale: Staff status, role criticality, qualification, centre assignment, teaching scope, and payroll deduction eligibility.">
              <Info className="h-4 w-4 text-blue-600 cursor-help" />
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-white/80 p-3">
            <p className="text-sm leading-relaxed">{aiAssessment.overview}</p>
            <p className="text-xs text-muted-foreground mt-2">Model confidence: <span className="font-semibold">{aiAssessment.confidence}%</span></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="font-semibold text-green-800 mb-2">Strengths</p>
              {aiAssessment.strengths.map((item, idx) => (
                <p key={`str-${idx}`} className="text-xs text-green-700">• {item}</p>
              ))}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="font-semibold text-amber-800 mb-2">Risks</p>
              {aiAssessment.risks.map((item, idx) => (
                <p key={`risk-${idx}`} className="text-xs text-amber-700">• {item}</p>
              ))}
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="font-semibold text-blue-800 mb-2">Recommended Actions</p>
              {aiAssessment.actions.map((item, idx) => (
                <p key={`act-${idx}`} className="text-xs text-blue-700">• {item}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
