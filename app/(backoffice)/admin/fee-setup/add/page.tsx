'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';

export default function AddFeeStructurePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    instituteId: '',
    monthlyFee: '350',
    depositAmount: '100',
    registrationFee: '50',
    subsidyB40: '50',
    subsidyM40: '30',
    subsidyT20: '0',
    subsidyAsnaf: '100',
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateFinalFee = (monthlyFee: number, subsidyPercentage: number) => {
    const discount = (monthlyFee * subsidyPercentage) / 100;
    return monthlyFee - discount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const institute = malaysianInstitutes.find(i => i.id === formData.instituteId);
    console.log('Adding new fee structure:', formData);
    alert(`Fee structure for "${institute?.name}" has been created successfully!\n\nThis is a demo - in production, this would save to the database.`);
    router.push('/admin/fee-setup');
  };

  const selectedInstitute = malaysianInstitutes.find(i => i.id === formData.instituteId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/fee-setup">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Fee Setup
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Fee Structure</h1>
        <p className="text-muted-foreground">
          Configure fees and subsidies for an institute
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Institute Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Institute Selection</CardTitle>
                <CardDescription>Select the institute for this fee structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="instituteId">Institute *</Label>
                  <Select value={formData.instituteId} onValueChange={(value) => handleInputChange('instituteId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an institute" />
                    </SelectTrigger>
                    <SelectContent>
                      {malaysianInstitutes.map((institute) => (
                        <SelectItem key={institute.id} value={institute.id}>
                          {institute.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedInstitute && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="text-xs font-semibold text-blue-900 mb-1">Selected Institute</div>
                      <div className="text-sm font-medium">{selectedInstitute.name}</div>
                      <div className="text-xs text-gray-600 font-mono mt-1">{selectedInstitute.code}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {selectedInstitute.city}, {selectedInstitute.state}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date *</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Fee Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base Fees */}
            <Card>
              <CardHeader>
                <CardTitle>Base Fees</CardTitle>
                <CardDescription>Set the standard fees before subsidies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyFee">Monthly Fee (RM) *</Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      value={formData.monthlyFee}
                      onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                      placeholder="350"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationFee">Registration Fee (RM) *</Label>
                    <Input
                      id="registrationFee"
                      type="number"
                      value={formData.registrationFee}
                      onChange={(e) => handleInputChange('registrationFee', e.target.value)}
                      placeholder="50"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Deposit Amount (RM) *</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={formData.depositAmount}
                      onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                      placeholder="100"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subsidy Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Subsidy Configuration</CardTitle>
                <CardDescription>Set discount percentages for each category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Asnaf */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="subsidyAsnaf">Asnaf (Full Subsidy) - Discount %</Label>
                        <Input
                          id="subsidyAsnaf"
                          type="number"
                          value={formData.subsidyAsnaf}
                          onChange={(e) => handleInputChange('subsidyAsnaf', e.target.value)}
                          placeholder="100"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div className="p-3 bg-white rounded-md border">
                        <div className="text-xs text-gray-600">Final Monthly Fee</div>
                        <div className="text-lg font-bold text-purple-700">
                          RM {calculateFinalFee(Number(formData.monthlyFee), Number(formData.subsidyAsnaf)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B40 */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="subsidyB40">B40 (Bottom 40%) - Discount %</Label>
                        <Input
                          id="subsidyB40"
                          type="number"
                          value={formData.subsidyB40}
                          onChange={(e) => handleInputChange('subsidyB40', e.target.value)}
                          placeholder="50"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div className="p-3 bg-white rounded-md border">
                        <div className="text-xs text-gray-600">Final Monthly Fee</div>
                        <div className="text-lg font-bold text-green-700">
                          RM {calculateFinalFee(Number(formData.monthlyFee), Number(formData.subsidyB40)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* M40 */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="subsidyM40">M40 (Middle 40%) - Discount %</Label>
                        <Input
                          id="subsidyM40"
                          type="number"
                          value={formData.subsidyM40}
                          onChange={(e) => handleInputChange('subsidyM40', e.target.value)}
                          placeholder="30"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div className="p-3 bg-white rounded-md border">
                        <div className="text-xs text-gray-600">Final Monthly Fee</div>
                        <div className="text-lg font-bold text-blue-700">
                          RM {calculateFinalFee(Number(formData.monthlyFee), Number(formData.subsidyM40)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* T20 */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="subsidyT20">T20 (Top 20%) - Discount %</Label>
                        <Input
                          id="subsidyT20"
                          type="number"
                          value={formData.subsidyT20}
                          onChange={(e) => handleInputChange('subsidyT20', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div className="p-3 bg-white rounded-md border">
                        <div className="text-xs text-gray-600">Final Monthly Fee</div>
                        <div className="text-lg font-bold text-gray-700">
                          RM {calculateFinalFee(Number(formData.monthlyFee), Number(formData.subsidyT20)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <Link href="/admin/fee-setup">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">
                <DollarSign className="h-4 w-4 mr-2" />
                Create Fee Structure
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
