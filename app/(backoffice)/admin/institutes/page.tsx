'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { Pagination } from '@/components/ui/pagination';
import { Building2, Search, Pencil, Trash2, UserPlus, Eye } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 10;

export default function InstitutesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredInstitutes = malaysianInstitutes.filter(institute =>
    institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institute.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institute.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    institute.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalInstitutes = malaysianInstitutes.length;
  const activeInstitutes = malaysianInstitutes.filter(i => i.status === 'active').length;
  const totalStudentsAcrossInstitutes = malaysianInstitutes.reduce((sum, inst) => sum + inst.students, 0);
  const averageStudentsPerInstitute = Math.round(totalStudentsAcrossInstitutes / totalInstitutes);
  const largestInstitute = malaysianInstitutes.reduce((max, inst) => inst.students > max.students ? inst : max, malaysianInstitutes[0]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInstitutes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedInstitutes = filteredInstitutes.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institute / School</h1>
          <p className="text-muted-foreground">
            Manage religious schools and Islamic education centres
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Institutes</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstitutes}</div>
            <p className="text-xs text-muted-foreground">{activeInstitutes} active centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudentsAcrossInstitutes}</div>
            <p className="text-xs text-muted-foreground">Across all centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Students</CardTitle>
            <UserPlus className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStudentsPerInstitute}</div>
            <p className="text-xs text-muted-foreground">Per centre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Centre</CardTitle>
            <Building2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{largestInstitute.students}</div>
            <p className="text-xs text-muted-foreground">{largestInstitute.code}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Institutes</CardTitle>
              <CardDescription>View and manage institute records</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search institutes..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Link href="/admin/institutes/add">
                <Button className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Add Institute
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institute Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Total Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInstitutes.map((institute) => (
                <TableRow key={institute.id}>
                  <TableCell className="font-medium font-mono text-sm">{institute.code}</TableCell>
                  <TableCell className="font-medium">{institute.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{institute.city}</div>
                      <div className="text-xs text-muted-foreground">{institute.state}</div>
                    </div>
                  </TableCell>
                  <TableCell>{institute.capacity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-gray-400" />
                      <span>{institute.students} students</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(institute.status)}>
                      {institute.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/institutes/${institute.id}`} className="cursor-pointer">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/institutes/edit/${institute.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredInstitutes.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </CardContent>
      </Card>
    </div>
  );
}
