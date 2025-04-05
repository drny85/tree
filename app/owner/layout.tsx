import { Navbar } from "@/components/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-20 pb-8">{children}</main>
    </div>
  );
}
