import { LoginForm } from "@/components/auth/LoginForm";
import { FormMessage } from "@/components/ui/FormMessage";

type Props = {
  searchParams: Promise<{ registered?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { registered, reset } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          Welcome back
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Sign in</h1>
      </div>
      {registered && (
        <FormMessage variant="success">Account created. Sign in to continue.</FormMessage>
      )}
      {reset && (
        <FormMessage variant="success">Password reset. Sign in with your new password.</FormMessage>
      )}
      <LoginForm />
    </div>
  );
}
