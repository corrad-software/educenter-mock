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

export default function AddStudentPage() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    ic: '',
    dateOfBirth: '',
    guardianName: '',
    guardianIc: '',
    guardianPhone: '',
    guardianEmail: '',
    centre: '',
    subsidyCategory: 'None',
    monthlyFee: '350',
    depositAmount: '100',
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
    console.log('Adding new student:', formData, 'Photo:', profilePhoto);
    alert(`Student "${formData.name}" has been added successfully!\n\nThis is a demo - in production, this would save to the database.`);
    router.push('/admin/students');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Student</h1>
        <p className="text-muted-foreground">
          Fill in the student details below. All fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Photo */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Upload student photo (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {/* Photo Preview */}
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

                  {/* Upload Button */}
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
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
                <CardDescription>Basic student details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ahmad bin Abdullah"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ic">IC Number *</Label>
                    <Input
                      id="ic"
                      value={formData.ic}
                      onChange={(e) => handleInputChange('ic', e.target.value)}
                      placeholder="081234-05-1234"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="centre">Centre *</Label>
                    <Select value={formData.centre} onValueChange={(value) => handleInputChange('centre', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a centre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KEMAS-KL-001">KEMAS Kampung Baru - Kuala Lumpur</SelectItem>
                        <SelectItem value="KEMAS-SEL-002">KEMAS Taman Melati - Gombak, Selangor</SelectItem>
                        <SelectItem value="KEMAS-SEL-003">KEMAS Bangi - Bangi, Selangor</SelectItem>
                        <SelectItem value="KEMAS-JHR-001">KEMAS Johor Bahru - Johor</SelectItem>
                        <SelectItem value="KEMAS-PEN-001">KEMAS Butterworth - Penang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guardian Information */}
            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
                <CardDescription>Parent or guardian details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                      placeholder="Abdullah bin Hassan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianIc">Guardian IC *</Label>
                    <Input
                      id="guardianIc"
                      value={formData.guardianIc}
                      onChange={(e) => handleInputChange('guardianIc', e.target.value)}
                      placeholder="750101-05-1234"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Phone Number *</Label>
                    <Input
                      id="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                      placeholder="012-3456789"
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="guardianEmail">Email Address</Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      value={formData.guardianEmail}
                      onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
                      placeholder="guardian@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Information */}
            <Card>
              <CardHeader>
                <CardTitle>Fee & Subsidy Information</CardTitle>
                <CardDescription>Monthly fee and subsidy category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subsidyCategory">Subsidy Category *</Label>
                    <Select value={formData.subsidyCategory} onValueChange={(value) => handleInputChange('subsidyCategory', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B40">B40 (Bottom 40% - 50% subsidy)</SelectItem>
                        <SelectItem value="M40">M40 (Middle 40% - 30% subsidy)</SelectItem>
                        <SelectItem value="T20">T20 (Top 20% - No subsidy)</SelectItem>
                        <SelectItem value="Asnaf">Asnaf (Full subsidy)</SelectItem>
                        <SelectItem value="None">None (No subsidy)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyFee">Monthly Fee (RM) *</Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      value={formData.monthlyFee}
                      onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                      placeholder="350"
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
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <Link href="/admin/students">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">
                Add Student
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
