import { authClient } from '@repo/auth/auth-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';
import { NavSidebar } from '@/components/nav-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session) {
      router.navigate({ to: '/' });
    } else {
      router.navigate({ to: '/signin' });
    }
  }, [isPending, session, router.navigate]);

  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-screen">
          {session && <NavSidebar />}
          <SidebarInset className="flex-1">
            <div className="flex h-full flex-col">
              {/*{session && (*/}
              {/*  <nav className="v border-b p-4 text-white">*/}
              {/*    <div className="container mx-auto flex items-center justify-between">*/}
              {/*      <div>*/}
              {/*        <UploadProgress />*/}
              {/*      </div>*/}
              {/*      <div className="flex items-center gap-2">*/}
              {/*        <Upload />*/}
              {/*        <UserButton />*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </nav>*/}
              {/*)}*/}
              <main className="flex-1 overflow-auto p-6">
                <Outlet />
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
