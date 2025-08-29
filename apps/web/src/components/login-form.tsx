import { authClient } from '@repo/auth/auth-client';
import { useForm } from '@tanstack/react-form';
import { Link, useRouter } from '@tanstack/react-router';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zSignInSchema } from '@/schema/login';

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<'div'>) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: zSignInSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          ...value,
          callbackURL: '/',
        },
        {
          onRequest: () => {
            //show loading
          },
          onSuccess: () => {
            router.navigate({ to: '/' });
          },
          onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
          },
        }
      );
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit().then();
            }}
          >
            <form.Field name="email">
              {(field) => {
                return (
                  <Input
                    aria-label="Email"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email"
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                return (
                  <Input
                    aria-label="Password"
                    type="password"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  className="w-full"
                  color="primary"
                  disabled={!canSubmit}
                  type="submit"
                >
                  {isSubmitting ? '...' : 'Sign In'}
                </Button>
              )}
            </form.Subscribe>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link className="underline underline-offset-4" to="/signup">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
