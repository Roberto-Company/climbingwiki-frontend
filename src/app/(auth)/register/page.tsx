import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          Join the wiki
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Create an account</h1>
      </div>
      <RegisterForm />
    </div>
  );
}
