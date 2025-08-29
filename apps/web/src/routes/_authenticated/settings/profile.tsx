import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: Profile,
});

function Profile() {
  return (
    <div className="container mx-auto my-8 max-w-4xl">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-1">
            <Link
              activeProps={{
                className: 'bg-accent text-accent-foreground',
              }}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-start'
              )}
              to="/settings/api-keys"
            >
              API Keys
            </Link>
          </nav>
        </aside>
        <main className="md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
