import { verifySession } from "@/lib/auth/dal";
import { logoutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

export default async function ProfilePage() {
  const session = await verifySession();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          Your account
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{session.username}</h1>
        <span className="mt-3 inline-block rounded-full bg-moss-50 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-moss-800">
          {session.role}
        </span>
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="ghost">
          Log out
        </Button>
      </form>
    </div>
  );
}
