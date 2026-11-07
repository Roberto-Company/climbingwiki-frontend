"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { updateProfileAction, type ProfileFormState } from "@/lib/users/actions";
import { BIO_MAX, FULL_NAME_MAX } from "@/lib/users/profile-form";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";

type Props = {
  fullName: string | null;
  bio: string | null;
};

const initialState: ProfileFormState = {};

export function ProfileForm({ fullName, bio }: Props) {
  const t = useTranslations("Account.settings");
  const tc = useTranslations("Common");
  const [state, action, isPending] = useActionState(updateProfileAction, initialState);
  const [bioLength, setBioLength] = useState(bio?.length ?? 0);

  return (
    <form action={action} className="flex flex-col gap-4">
      <TextField
        label={t("fullName")}
        name="fullName"
        defaultValue={fullName ?? ""}
        maxLength={FULL_NAME_MAX}
        autoComplete="name"
        placeholder={t("fullNamePlaceholder")}
        error={state.fieldErrors?.fullName}
      />
      <div className="flex flex-col gap-1">
        <TextArea
          label={t("bio")}
          name="bio"
          defaultValue={bio ?? ""}
          maxLength={BIO_MAX}
          rows={4}
          placeholder={t("bioPlaceholder")}
          onChange={(event) => setBioLength(event.target.value.length)}
          error={state.fieldErrors?.bio}
          aria-describedby="bio-count"
        />
        <p id="bio-count" className="self-end font-sans text-xs tabular-nums text-stone">
          {t("characters", { count: bioLength, max: BIO_MAX })}
        </p>
      </div>
      <div aria-live="polite">
        {state.error && !state.fieldErrors && <FormMessage variant="error">{state.error}</FormMessage>}
        {state.success && <FormMessage variant="success">{t("profileSaved")}</FormMessage>}
      </div>
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? tc("saving") : t("saveProfile")}
      </Button>
    </form>
  );
}
