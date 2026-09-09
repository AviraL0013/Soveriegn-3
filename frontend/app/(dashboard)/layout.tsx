import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <TopBar />
      <main className="lg:ml-64 pt-14 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-unit-8 pb-unit-16">
          {children}
        </div>
      </main>
    </>
  );
}
