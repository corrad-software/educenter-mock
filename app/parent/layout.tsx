import { ParentHeader } from '@/components/portal/parent-header';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <ParentHeader />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}
