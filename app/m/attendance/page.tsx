'use client';

import { useState } from 'react';
import { Check, X, Clock, Users, ChevronDown } from 'lucide-react';

const CLASSES = [
  { id: 'c1', name: '5 Cemerlang', studentCount: 30 },
  { id: 'c2', name: '4 Bestari', studentCount: 28 },
  { id: 'c3', name: '6 Amanah', studentCount: 32 },
  { id: 'c4', name: '3 Bijak', studentCount: 22 },
];

const STUDENTS: Record<string, { id: string; name: string }[]> = {
  c1: [
    { id: 's1', name: 'Ahmad bin Abdullah' },
    { id: 's2', name: 'Nurul Huda binti Ismail' },
    { id: 's3', name: 'Muhammad Aiman bin Razak' },
    { id: 's4', name: 'Siti Aminah binti Hassan' },
    { id: 's5', name: 'Irfan bin Mohd Yusof' },
    { id: 's6', name: 'Aisyah binti Kamal' },
    { id: 's7', name: 'Hafiz bin Othman' },
    { id: 's8', name: 'Fatimah binti Salleh' },
    { id: 's9', name: 'Zulkifli bin Ahmad' },
    { id: 's10', name: 'Maryam binti Idris' },
  ],
  c2: [
    { id: 's11', name: 'Haziq bin Zainal' },
    { id: 's12', name: 'Nur Syafiqah binti Ali' },
    { id: 's13', name: 'Adam bin Rahman' },
    { id: 's14', name: 'Iman binti Hamid' },
    { id: 's15', name: 'Danial bin Sulaiman' },
    { id: 's16', name: 'Hana binti Majid' },
    { id: 's17', name: 'Rizal bin Omar' },
    { id: 's18', name: 'Anis binti Azman' },
  ],
  c3: [
    { id: 's19', name: 'Farhan bin Rosli' },
    { id: 's20', name: 'Nabila binti Noor' },
    { id: 's21', name: 'Hakim bin Jaafar' },
    { id: 's22', name: 'Safiya binti Latif' },
    { id: 's23', name: 'Aqil bin Hamdan' },
    { id: 's24', name: 'Zara binti Fikri' },
    { id: 's25', name: 'Luqman bin Halim' },
    { id: 's26', name: 'Amira binti Nasir' },
    { id: 's27', name: 'Ikram bin Bakar' },
  ],
  c4: [
    { id: 's28', name: 'Syahir bin Wahab' },
    { id: 's29', name: 'Puteri binti Shahril' },
    { id: 's30', name: 'Nabil bin Rahim' },
    { id: 's31', name: 'Alya binti Haziq' },
    { id: 's32', name: 'Imran bin Fauzi' },
    { id: 's33', name: 'Sara binti Khairul' },
    { id: 's34', name: 'Umar bin Saiful' },
  ],
};

type AttendanceStatus = 'present' | 'absent' | 'late' | null;

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0].id);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentClass = CLASSES.find(c => c.id === selectedClass) ?? CLASSES[0];
  const students = STUDENTS[selectedClass] ?? [];

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(prev => ({ ...prev, ...updated }));
  };

  const toggle = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status,
    }));
  };

  const presentCount = students.filter(s => attendance[s.id] === 'present').length;
  const absentCount = students.filter(s => attendance[s.id] === 'absent').length;
  const lateCount = students.filter(s => attendance[s.id] === 'late').length;
  const unmarkedCount = students.filter(s => !attendance[s.id]).length;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const today = new Date().toLocaleDateString('en-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">Attendance</h1>
        <p className="text-xs text-gray-500">{today}</p>
      </div>

      {/* Class Picker */}
      <div className="relative">
        <button
          onClick={() => setShowClassPicker(!showClassPicker)}
          className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{currentClass.name}</p>
              <p className="text-xs text-gray-500">{currentClass.studentCount} students</p>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showClassPicker ? 'rotate-180' : ''}`} />
        </button>

        {showClassPicker && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowClassPicker(false)} />
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              {CLASSES.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => {
                    setSelectedClass(cls.id);
                    setShowClassPicker(false);
                    setAttendance({});
                    setSubmitted(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    cls.id === selectedClass ? 'bg-blue-50' : 'active:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                    <p className="text-xs text-gray-500">{cls.studentCount} students</p>
                  </div>
                  {cls.id === selectedClass && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => markAll('present')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-medium active:bg-green-100 border border-green-200"
        >
          <Check className="h-3.5 w-3.5" /> All Present
        </button>
        <button
          onClick={() => markAll(null)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium active:bg-gray-100 border border-gray-200"
        >
          Reset
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-2">
        <div className="flex-1 text-center bg-green-50 rounded-lg py-2 border border-green-100">
          <p className="text-sm font-bold text-green-700">{presentCount}</p>
          <p className="text-[10px] text-green-600">Present</p>
        </div>
        <div className="flex-1 text-center bg-red-50 rounded-lg py-2 border border-red-100">
          <p className="text-sm font-bold text-red-700">{absentCount}</p>
          <p className="text-[10px] text-red-600">Absent</p>
        </div>
        <div className="flex-1 text-center bg-yellow-50 rounded-lg py-2 border border-yellow-100">
          <p className="text-sm font-bold text-yellow-700">{lateCount}</p>
          <p className="text-[10px] text-yellow-600">Late</p>
        </div>
        <div className="flex-1 text-center bg-gray-50 rounded-lg py-2 border border-gray-100">
          <p className="text-sm font-bold text-gray-500">{unmarkedCount}</p>
          <p className="text-[10px] text-gray-400">Unmarked</p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {students.map((student, i) => {
          const status = attendance[student.id];
          return (
            <div key={student.id} className="px-4 py-3 flex items-center gap-3">
              {/* Number + Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  <span className="text-xs text-gray-400 mr-1.5">{i + 1}.</span>
                  {student.name}
                </p>
              </div>

              {/* Status Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggle(student.id, 'present')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    status === 'present'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-400 active:bg-green-100'
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggle(student.id, 'absent')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    status === 'absent'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-400 active:bg-red-100'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggle(student.id, 'late')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    status === 'late'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-400 active:bg-yellow-100'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={unmarkedCount > 0}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
          submitted
            ? 'bg-green-500 text-white'
            : unmarkedCount > 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white active:bg-blue-700'
        }`}
      >
        {submitted ? 'Attendance Submitted!' : unmarkedCount > 0 ? `Mark All Students (${unmarkedCount} remaining)` : 'Submit Attendance'}
      </button>

      {/* Bottom spacing for tab bar */}
      <div className="h-4" />
    </div>
  );
}
