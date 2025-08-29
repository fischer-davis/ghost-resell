import {Outlet} from '@tanstack/react-router';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import {NavSidebar} from './nav-sidebar';

export function SettingsLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <NavSidebar/>
        <SidebarInset className="flex-1">
          <div className="flex h-full flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
              <h1 className="font-semibold text-xl">Settings</h1>
            </header>
            <main className="flex-1 overflow-auto p-6">
              <Outlet/>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
