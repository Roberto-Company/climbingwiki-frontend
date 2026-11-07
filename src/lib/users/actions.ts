"use server";

import { revalidatePath } from "next/cache";
import { validationError } from "@/i18n/validation-error";
import { ApiError, deleteAvatar, updateProfile, uploadAvatar } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { checkAvatarFile, parseProfileForm } from "./profile-form";

export interface ProfileFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

function apiErrorState(error: unknown): ProfileFormState {
  if (error instanceof ApiError) {
    return { error: error.message, fieldErrors: error.validationErrors };
  }
  throw error;
}

/** The header, settings page and public profile all show these fields. */
function refreshProfilePages(userId: number) {
  revalidatePath("/", "layout");
  revalidatePath(`/users/${userId}`);
}

export async function updateProfileAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await verifySession();
  const parsed = parseProfileForm(formData);
  if (!parsed.ok) {
    const { error } = await validationError(parsed.error);
    return { error, fieldErrors: { [parsed.field]: error } };
  }

  try {
    await updateProfile(session.userId, parsed.value, session.token);
  } catch (error) {
    return apiErrorState(error);
  }
  refreshProfilePages(session.userId);
  return { success: true };
}

export async function uploadAvatarAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await verifySession();
  const file = formData.get("avatar");
  const problem = checkAvatarFile(file);
  if (problem) {
    return validationError(problem);
  }

  try {
    await uploadAvatar(session.userId, file as Blob, session.token);
  } catch (error) {
    return apiErrorState(error);
  }
  refreshProfilePages(session.userId);
  return { success: true };
}

export async function removeAvatarAction(): Promise<ProfileFormState> {
  const session = await verifySession();
  try {
    await deleteAvatar(session.userId, session.token);
  } catch (error) {
    return apiErrorState(error);
  }
  refreshProfilePages(session.userId);
  return { success: true };
}
