import { Navbar } from "@/components/layout/navbar";
import { siteConfig } from "@/config/site";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto max-w-7xl p-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <span className="text-default-600">{siteConfig.footer}</span>
      </footer>
    </div>
  );
}
