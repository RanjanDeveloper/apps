import Topbar from "@/components/dashboard/topbar";
import Sidebar from "@/components/dashboard/sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
    <Topbar />
    <div className="flex h-screen pt-14">
      <Sidebar />
      <div className="p-4 bg-white w-full overflow-y-auto"> {children}</div>
    </div>
    </>
  );
}
