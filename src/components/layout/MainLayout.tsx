import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProfileButton } from "./ProfileButton";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <SidebarTrigger />
              <ProfileButton />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
