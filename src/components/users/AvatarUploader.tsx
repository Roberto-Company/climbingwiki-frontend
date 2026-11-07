"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { removeAvatarAction, uploadAvatarAction, type ProfileFormState } from "@/lib/users/actions";
import type { AvatarUser } from "@/lib/users/avatar";
import { resizeForAvatar } from "@/lib/users/resize-image";
import { FormMessage } from "@/components/ui/FormMessage";
import { Avatar } from "./Avatar";

type Props = {
  user: AvatarUser;
};

/** Pick a picture, see it at once, and upload a small square version of it. */
export function AvatarUploader({ user }: Props) {
  const t = useTranslations("Account.settings");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<ProfileFormState>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    startTransition(async () => {
      let resized: Blob;
      try {
        resized = await resizeForAvatar(file);
      } catch {
        setState({ error: t("pictureUnreadable") });
        return;
      }
      setPreview(URL.createObjectURL(resized));
      const formData = new FormData();
      formData.set("avatar", resized, "avatar");
      const result = await uploadAvatarAction({}, formData);
      setState(result.success ? { success: true } : result);
      if (!result.success) {
        setPreview(null);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeAvatarAction();
      setState(result);
      setPreview(null);
    });
  }

  const hasPicture = Boolean(preview ?? user.avatarUrl);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative">
        {preview ? (
          // A local preview URL: shown as a plain image, it never goes through the media route.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" width={128} height={128} className="h-32 w-32 rounded-full object-cover ring-4 ring-background" />
        ) : (
          <Avatar user={user} size="xl" className="ring-4" />
        )}
        {isPending && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-night/45">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-semibold text-background transition-colors hover:bg-moss-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hasPicture ? t("changePicture") : t("uploadPicture")}
          </button>
          {hasPicture && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 font-sans text-sm font-semibold text-stone transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t("removePicture")}
            </button>
          )}
        </div>
        <p className="font-sans text-xs text-stone">{t("pictureHint")}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div aria-live="polite">
          {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
          {state.success && <FormMessage variant="success">{t("pictureSaved")}</FormMessage>}
        </div>
      </div>
    </div>
  );
}
