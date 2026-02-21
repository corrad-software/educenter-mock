import { TeacherHeader } from '@/components/portal/teacher-header';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <TeacherHeader />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}
