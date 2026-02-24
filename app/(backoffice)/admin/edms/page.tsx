'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Folder, Download, CheckCircle2, XCircle } from 'lucide-react';
import type { RegistrationDocumentRecord } from '@/lib/types/registration-edms';

interface EdmsResponse {
  documents: RegistrationDocumentRecord[];
}

export default function EdmsPage() {
  const [documents, setDocuments] = useState<RegistrationDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [applicationRef, setApplicationRef] = useState('');
  const [docType, setDocType] = useState('all');
  const [status, setStatus] = useState('all');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (applicationRef.trim()) params.set('applicationRef', applicationRef.trim());
    if (docType !== 'all') params.set('docType', docType);
    if (status !== 'all') params.set('status', status);
    return params.toString();
  }, [applicationRef, docType, status]);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/edms/documents${query ? `?${query}` : ''}`, { cache: 'no-store' });
      const json = await res.json() as EdmsResponse & { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Failed to load EDMS documents.');
        return;
      }
      setDocuments(json.documents);
    } catch {
      setError('Failed to load EDMS documents.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const appRef = new URLSearchParams(window.location.search).get('applicationRef');
      if (appRef) setApplicationRef(appRef);
    }
  }, []);

  useEffect(() => {
    void loadDocs();
  }, [loadDocs]);

  const runVerify = async (documentId: string, nextStatus: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/edms/documents/${documentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, reviewerName: 'Centre Admin' }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Failed to update document status.');
        return;
      }
      await loadDocs();
    } catch {
      setError('Failed to update document status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Folder className="h-6 w-6 text-blue-600" />EDMS</h1>
          <p className="text-muted-foreground">Centralized registration attachment repository.</p>
        </div>
        <Link href="/admin/students/applications"><Button variant="outline">Back to Applications</Button></Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Filters</CardTitle>
          <CardDescription>Search and verify registration attachments</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Application Ref (e.g. APP-2026-00001)" value={applicationRef} onChange={(e) => setApplicationRef(e.target.value)} />
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="birth_cert">Birth Cert</SelectItem>
              <SelectItem value="student_ic">Student IC</SelectItem>
              <SelectItem value="guardian_ic">Guardian IC</SelectItem>
              <SelectItem value="address_proof">Address Proof</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="uploaded">Uploaded</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>{documents.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application Ref</TableHead>
                  <TableHead>Doc Type</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-xs">{doc.applicationRef}</TableCell>
                    <TableCell>{doc.docType}</TableCell>
                    <TableCell>{doc.originalName}</TableCell>
                    <TableCell>{(doc.size / 1024).toFixed(1)} KB</TableCell>
                    <TableCell><Badge variant="outline">{doc.status}</Badge></TableCell>
                    <TableCell>{new Date(doc.uploadedAt).toLocaleDateString('en-MY')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a href={`/api/admin/edms/documents/${doc.id}/download`} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline" className="gap-1"><Download className="h-3.5 w-3.5" />View</Button>
                        </a>
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => void runVerify(doc.id, 'verified')}>
                          <CheckCircle2 className="h-3.5 w-3.5" />Verify
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1" onClick={() => void runVerify(doc.id, 'rejected')}>
                          <XCircle className="h-3.5 w-3.5" />Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
