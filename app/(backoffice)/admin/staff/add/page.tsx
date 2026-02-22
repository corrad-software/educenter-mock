'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { useEducationStore } from '@/lib/store/education-store';

export default function AddStaffPage() {
  const router = useRouter();
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'maiwp';

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    ic: '',
    email: '',
    phone: '',
    role: '',
    qualification: '',
    centreId: '',
    educationLevel: level === 'maiwp' ? '' : level,
    joinDate: '',
    monthlySalary: '',
    hasChildEnrolled: 'false',
    subjectsTaught: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const centre = malaysianInstitutes.find(i => i.id === formData.centreId);
    console.log('Adding new staff:', formData, 'Photo:', profilePhoto);
    alert(`Staff "${formData.name}" has been added successfully to ${centre?.name ?? 'N/A'}!\n\nThis is a demo — in production, this would save to the database.`);
    router.push('/admin/staff');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/staff">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Staff
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Staff</h1>
        <p className="text-muted-foreground">
          Fill in the staff details below. All fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Photo */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Upload staff photo (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    {profilePhoto ? (
                      <>
                        <Image
                          src={profilePhoto}
                          alt="Profile preview"
                          fill
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <User className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No photo uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                        </span>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      JPG, PNG or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Staff personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Pn. Norliza binti Ahmad"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ic">IC Number *</Label>
                    <Input
                      id="ic"
                      value={formData.ic}
                      onChange={(e) => handleInputChange('ic', e.target.value)}
                      placeholder="850412-14-5234"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+60123001001"
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="norliza@maiwp.gov.my"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Information</CardTitle>
                <CardDescription>Role, centre assignment and qualifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                        <SelectItem value="admin_staff">Admin Staff</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {level === 'maiwp' && (
                    <div className="space-y-2">
                      <Label htmlFor="educationLevel">Education Level *</Label>
                      <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preschool">Preschool / Tadika</SelectItem>
                          <SelectItem value="primary">Primary School</SelectItem>
                          <SelectItem value="secondary">Secondary School</SelectItem>
                          <SelectItem value="university">University / Higher Ed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className={level === 'maiwp' ? 'col-span-2 space-y-2' : 'space-y-2'}>
                    <Label htmlFor="centreId">Centre / Institution *</Label>
                    <Select value={formData.centreId} onValueChange={(value) => handleInputChange('centreId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a centre" />
                      </SelectTrigger>
                      <SelectContent>
                        {levelInstitutes.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.code} — {inst.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="qualification">Qualification *</Label>
                    <Input
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      placeholder="Diploma Pendidikan Awal Kanak-Kanak"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date *</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => handleInputChange('joinDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlySalary">Monthly Salary (RM) *</Label>
                    <Input
                      id="monthlySalary"
                      type="number"
                      value={formData.monthlySalary}
                      onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                      placeholder="2800"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching & Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching & Additional Info</CardTitle>
                <CardDescription>Subjects and payroll deduction eligibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="subjectsTaught">Subjects Taught</Label>
                    <Input
                      id="subjectsTaught"
                      value={formData.subjectsTaught}
                      onChange={(e) => handleInputChange('subjectsTaught', e.target.value)}
                      placeholder="Literacy, Numeracy (comma-separated)"
                    />
                    <p className="text-xs text-muted-foreground">Leave blank for non-teaching staff</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasChildEnrolled">Child Enrolled in MAIWP?</Label>
                    <Select value={formData.hasChildEnrolled} onValueChange={(value) => handleInputChange('hasChildEnrolled', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes — Eligible for payroll deduction</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <Link href="/admin/staff">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">
                Add Staff
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
