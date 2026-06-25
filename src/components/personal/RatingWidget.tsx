"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitRatingAction, deleteRatingAction, type PersonalFormState } from "@/lib/personal/actions";
import { StarDisplay } from "./StarDisplay";

const HALF_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

const initialState: PersonalFormState = {};

type Props = {
  routeId: number;
  average: number | null;
  count: number;
  userScore: number | null;
  isAuthenticated: boolean;
};

export function RatingWidget({ routeId, average, count, userScore, isAuthenticated }: Props) {
  const [submitState, submitAction, submitPending] = useActionState(submitRatingAction, initialState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteRatingAction, initialState);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {average !== null ? (
          <StarDisplay score={average} />
        ) : (
          <span className="font-sans text-sm text-stone">No ratings yet</span>
        )}
        {count > 0 && <span className="font-sans text-xs text-stone">({count})</span>}
      </div>

      {isAuthenticated ? (
        <div className="flex flex-wrap items-center gap-2">
          <form action={submitAction} className="flex flex-wrap items-center gap-1">
            <input type="hidden" name="routeId" value={routeId} />
            {HALF_STEPS.map((step) => (
              <button
                key={step}
                type="submit"
                name="score"
                value={step}
                disabled={submitPending}
                className={`rounded-md px-2 py-1 font-sans text-xs font-semibold transition-colors ${
                  userScore === step
                    ? "bg-moss-600 text-background"
                    : "bg-moss-50 text-moss-800 hover:bg-moss-100"
                }`}
              >
                {step}
              </button>
            ))}
          </form>
          {userScore !== null && (
            <form action={deleteAction}>
              <input type="hidden" name="routeId" value={routeId} />
              <button
                type="submit"
                disabled={deletePending}
                className="font-sans text-xs font-medium text-stone underline hover:text-red-700"
              >
                Clear my rating
              </button>
            </form>
          )}
        </div>
      ) : (
        <Link href="/login" className="font-sans text-sm font-medium text-moss-600 hover:text-moss-800">
          Sign in to rate
        </Link>
      )}

      {submitState.error && <p className="font-sans text-xs text-red-700">{submitState.error}</p>}
      {submitState.fieldErrors?.score && (
        <p className="font-sans text-xs text-red-700">{submitState.fieldErrors.score}</p>
      )}
      {deleteState.error && <p className="font-sans text-xs text-red-700">{deleteState.error}</p>}
    </div>
  );
}
