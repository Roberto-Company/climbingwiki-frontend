import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          Locked out?
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Reset your password</h1>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
