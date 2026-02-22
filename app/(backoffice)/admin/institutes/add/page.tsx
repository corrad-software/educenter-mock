'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEducationStore } from '@/lib/store/education-store';
import type { EducationLevel } from '@/lib/types';

const INSTITUTE_TYPES: Record<string, string[]> = {
  preschool: ['Tadika Islam', 'MAIWP Kids (TMK)', 'Tadika Permata MAIWP (TPM)'],
  primary: ['SABK', 'SRAI'],
  secondary: ['SMA (SABK)', 'SMISTA (SABK)'],
  university: ['Kolej Profesional', 'Institut Kemahiran'],
};

const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Wilayah Persekutuan',
];

export default function AddInstitutePage() {
  const router = useRouter();
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'maiwp';

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    educationLevel: level === 'maiwp' ? '' : level,
    type: '',
    address: '',
    city: '',
    state: '',
    capacity: '50',
    students: '0',
    phone: '',
    established: '',
  });

  // Get available types based on selected education level
  const availableTypes = formData.educationLevel
    ? INSTITUTE_TYPES[formData.educationLevel] || []
    : Object.values(INSTITUTE_TYPES).flat();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new institute:', formData);
    alert(`Institute "${formData.name}" has been added successfully!\n\nThis is a demo - in production, this would save to the database.`);
    router.push('/admin/institutes');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/institutes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Institutes
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Institute</h1>
        <p className="text-muted-foreground">
          Fill in the institute details below. All fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Institute Information */}
          <Card>
            <CardHeader>
              <CardTitle>Institute Information</CardTitle>
              <CardDescription>Basic institute details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Institute Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Sekolah Agama Bantuan Kerajaan..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Institute Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="SABK-WP-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level *</Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(value) => {
                      handleInputChange('educationLevel', value);
                      handleInputChange('type', '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preschool">Preschool / Tadika</SelectItem>
                      <SelectItem value="primary">Primary School (SABK / SRAI)</SelectItem>
                      <SelectItem value="secondary">Secondary School (SMA)</SelectItem>
                      <SelectItem value="university">University / Higher Ed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Institute Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.educationLevel ? 'Select type' : 'Select level first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {MALAYSIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>Address and location details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Jalan Raja Laut"
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Kuala Lumpur"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Information */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity Information</CardTitle>
              <CardDescription>Student capacity and enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Maximum Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="50"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">Current Students</Label>
                  <Input
                    id="students"
                    type="number"
                    value={formData.students}
                    onChange={(e) => handleInputChange('students', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="03-2691 1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Year Established</Label>
                  <Input
                    id="established"
                    value={formData.established}
                    onChange={(e) => handleInputChange('established', e.target.value)}
                    placeholder="2010"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/admin/institutes">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">
              <Building2 className="h-4 w-4 mr-2" />
              Add Institute
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
