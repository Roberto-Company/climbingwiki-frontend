import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          One more step
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Verify your email</h1>
      </div>
      <VerifyEmailForm />
    </div>
  );
}
