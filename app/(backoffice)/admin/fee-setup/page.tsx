'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { feeStructures, FeeStructure } from '@/lib/mock-data/fee-structures';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { Settings, DollarSign, Pencil, Eye, Plus } from 'lucide-react';
import Link from 'next/link';

export default function FeeSetupPage() {
  const [selectedInstitute, setSelectedInstitute] = useState('all');

  const filteredStructures = selectedInstitute === 'all'
    ? feeStructures
    : feeStructures.filter(fs => fs.instituteId === selectedInstitute);

  const getSubsidyBadgeColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-purple-500';
    if (percentage >= 50) return 'bg-green-500';
    if (percentage >= 30) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const calculateExampleFees = (structure: FeeStructure) => {
    return {
      b40: structure.monthlyFee - (structure.monthlyFee * structure.subsidies.B40 / 100),
      m40: structure.monthlyFee - (structure.monthlyFee * structure.subsidies.M40 / 100),
      t20: structure.monthlyFee - (structure.monthlyFee * structure.subsidies.T20 / 100),
      asnaf: structure.monthlyFee - (structure.monthlyFee * structure.subsidies.Asnaf / 100),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Setup</h1>
          <p className="text-muted-foreground">
            Configure monthly fees and subsidy rates for each institute
          </p>
        </div>
        <Link href="/admin/fee-setup/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Fee Structure
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Institutes</CardTitle>
            <Settings className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feeStructures.length}</div>
            <p className="text-xs text-muted-foreground">Configured fee structures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {Math.round(feeStructures.reduce((sum, fs) => sum + fs.monthlyFee, 0) / feeStructures.length)}
            </div>
            <p className="text-xs text-muted-foreground">Across all institutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {Math.max(...feeStructures.map(fs => fs.monthlyFee))}
            </div>
            <p className="text-xs text-muted-foreground">Maximum monthly fee</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {Math.min(...feeStructures.map(fs => fs.monthlyFee))}
            </div>
            <p className="text-xs text-muted-foreground">Minimum monthly fee</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Structures Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fee Structures</CardTitle>
              <CardDescription>View and manage fee configurations by institute</CardDescription>
            </div>
            <div className="w-64">
              <Select value={selectedInstitute} onValueChange={setSelectedInstitute}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by institute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutes</SelectItem>
                  {malaysianInstitutes.map(institute => (
                    <SelectItem key={institute.id} value={institute.id}>
                      {institute.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredStructures.map((structure) => {
              const exampleFees = calculateExampleFees(structure);
              return (
                <Card key={structure.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{structure.instituteName}</CardTitle>
                        <CardDescription className="font-mono text-xs mt-1">
                          {structure.instituteCode}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={structure.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {structure.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                        <Link href={`/admin/fee-setup/edit/${structure.id}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-2">
                            <Pencil className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Base Fees */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-gray-700">Base Fees</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-600">Monthly Fee</span>
                            <span className="font-bold text-lg">
                              RM {structure.monthlyFee.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-600">Registration Fee</span>
                            <span className="font-semibold">
                              RM {structure.registrationFee.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-600">Deposit Amount</span>
                            <span className="font-semibold">
                              RM {structure.depositAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subsidies */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-gray-700">Subsidy Categories</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-md border border-purple-200">
                            <div>
                              <div className="font-medium text-sm">Asnaf (Full Subsidy)</div>
                              <div className="text-xs text-gray-600">
                                {structure.subsidies.Asnaf}% discount = RM {exampleFees.asnaf.toFixed(2)}
                              </div>
                            </div>
                            <Badge className={getSubsidyBadgeColor(structure.subsidies.Asnaf)}>
                              {structure.subsidies.Asnaf}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-md border border-green-200">
                            <div>
                              <div className="font-medium text-sm">B40 (Bottom 40%)</div>
                              <div className="text-xs text-gray-600">
                                {structure.subsidies.B40}% discount = RM {exampleFees.b40.toFixed(2)}
                              </div>
                            </div>
                            <Badge className={getSubsidyBadgeColor(structure.subsidies.B40)}>
                              {structure.subsidies.B40}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-200">
                            <div>
                              <div className="font-medium text-sm">M40 (Middle 40%)</div>
                              <div className="text-xs text-gray-600">
                                {structure.subsidies.M40}% discount = RM {exampleFees.m40.toFixed(2)}
                              </div>
                            </div>
                            <Badge className={getSubsidyBadgeColor(structure.subsidies.M40)}>
                              {structure.subsidies.M40}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                            <div>
                              <div className="font-medium text-sm">T20 (Top 20%)</div>
                              <div className="text-xs text-gray-600">
                                {structure.subsidies.T20}% discount = RM {exampleFees.t20.toFixed(2)}
                              </div>
                            </div>
                            <Badge className={getSubsidyBadgeColor(structure.subsidies.T20)}>
                              {structure.subsidies.T20}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          Effective Date: {structure.effectiveDate.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div>
                          Last Updated: {structure.updatedAt.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredStructures.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No fee structures found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
