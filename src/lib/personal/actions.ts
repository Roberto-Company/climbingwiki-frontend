"use server";

import { validationError } from "@/i18n/validation-error";
import { revalidatePath } from "next/cache";
import {
  ApiError,
  type ValidationErrors,
  upsertFavorite,
  deleteFavorite,
  upsertFollow,
  deleteFollow,
  upsertRating,
  deleteRating,
  createComment,
  updateComment,
  deleteComment,
  createPhoto,
  deletePhoto,
  createLogbookEntry,
  updateLogbookEntry,
  deleteLogbookEntry,
  createRouteList,
  updateRouteList,
  deleteRouteList,
  upsertListRoute,
  deleteListRoute,
} from "@/lib/api";
import type { LogbookEntryResult } from "@/lib/types";
import { verifySession } from "@/lib/auth/dal";
import { isSafeHttpUrl } from "@/lib/url";

export interface PersonalFormState {
  error?: string;
  fieldErrors?: ValidationErrors;
  success?: boolean;
}

function formNumber(formData: FormData, key: string): number | null {
  const raw = formData.get(key);
  if (raw === null || raw === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isNaN(value) ? null : value;
}

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function errorState(error: unknown): PersonalFormState {
  if (error instanceof ApiError) {
    return { error: error.message, fieldErrors: error.validationErrors };
  }
  throw error;
}

// --- Favorites ---

export async function toggleFavoriteAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const routeId = formNumber(formData, "routeId");
  const intent = formString(formData, "intent");
  if (!routeId) {
    return validationError("missingRoute");
  }

  try {
    if (intent === "remove") {
      await deleteFavorite(session.userId, routeId, session.token);
    } else {
      await upsertFavorite({ userId: session.userId, routeId }, session.token);
    }
  } catch (error) {
    return errorState(error);
  }

  revalidatePath(`/routes/${routeId}`);
  revalidatePath("/favorites");
  return { success: true };
}

// --- Follows ---

export async function toggleFollowAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const followedId = formNumber(formData, "followedId");
  const intent = formString(formData, "intent");
  if (!followedId) {
    return validationError("missingUser");
  }

  try {
    if (intent === "remove") {
      await deleteFollow(session.userId, followedId, session.token);
    } else {
      await upsertFollow({ followerId: session.userId, followedId }, session.token);
    }
  } catch (error) {
    return errorState(error);
  }

  revalidatePath("/follows");
  return { success: true };
}

// --- Ratings ---

export async function submitRatingAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const routeId = formNumber(formData, "routeId");
  const score = formNumber(formData, "score");
  if (!routeId || score === null) {
    return validationError("missingRouteOrScore");
  }

  try {
    await upsertRating({ userId: session.userId, routeId, score }, session.token);
  } catch (error) {
    return errorState(error);
  }

  revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

export async function deleteRatingAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const routeId = formNumber(formData, "routeId");
  if (!routeId) {
    return validationError("missingRoute");
  }

  try {
    await deleteRating(session.userId, routeId, session.token);
  } catch (error) {
    return errorState(error);
  }

  revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

// --- Comments ---

export async function createCommentAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const routeId = formNumber(formData, "routeId");
  const cragId = formNumber(formData, "cragId");
  const parentCommentId = formNumber(formData, "parentCommentId");
  const body = formString(formData, "body");
  if (!body) {
    return validationError("commentRequired");
  }

  try {
    await createComment(
      { userId: session.userId, routeId, cragId, parentCommentId, body },
      session.token,
    );
  } catch (error) {
    return errorState(error);
  }

  if (routeId) revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

export async function updateCommentAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const id = formNumber(formData, "id");
  const ownerId = formNumber(formData, "ownerId");
  const routeId = formNumber(formData, "routeId");
  const cragId = formNumber(formData, "cragId");
  const parentCommentId = formNumber(formData, "parentCommentId");
  const body = formString(formData, "body");
  if (!id || !ownerId || !body) {
    return validationError("missingCommentData");
  }

  try {
    await updateComment(id, { userId: ownerId, routeId, cragId, parentCommentId, body }, session.token);
  } catch (error) {
    return errorState(error);
  }

  if (routeId) revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

export async function deleteCommentAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const id = formNumber(formData, "id");
  const routeId = formNumber(formData, "routeId");
  if (!id) {
    return validationError("missingComment");
  }

  try {
    await deleteComment(id, session.token);
  } catch (error) {
    return errorState(error);
  }

  if (routeId) revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

// --- Photos ---

export async function createPhotoAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const routeId = formNumber(formData, "routeId");
  const cragId = formNumber(formData, "cragId");
  const url = formString(formData, "url");
  const caption = formString(formData, "caption");
  const isTopo = formData.get("isTopo") === "on";

  if (!isSafeHttpUrl(url)) {
    return validationError("invalidPhotoUrl");
  }

  try {
    await createPhoto(
      { userId: session.userId, routeId, cragId, url, caption: caption || null, isTopo },
      session.token,
    );
  } catch (error) {
    return errorState(error);
  }

  if (routeId) revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

export async function deletePhotoAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const id = formNumber(formData, "id");
  const routeId = formNumber(formData, "routeId");
  if (!id) {
    return validationError("missingPhoto");
  }

  try {
    await deletePhoto(id, session.token);
  } catch (error) {
    return errorState(error);
  }

  if (routeId) revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

// --- Logbook entries ---

export async function createLogbookEntryAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const routeId = formNumber(formData, "routeId");
  const attemptDate = formString(formData, "attemptDate");
  const result = formString(formData, "result") as LogbookEntryResult;
  const notes = formString(formData, "notes");
  if (!routeId || !attemptDate || !result) {
    return validationError("logbookRequired");
  }

  try {
    await createLogbookEntry(
      { userId: session.userId, routeId, attemptDate, result, notes: notes || null },
      session.token,
    );
  } catch (error) {
    return errorState(error);
  }

  revalidatePath(`/routes/${routeId}`);
  revalidatePath("/logbook");
  return { success: true };
}

export async function updateLogbookEntryAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const id = formNumber(formData, "id");
  const ownerId = formNumber(formData, "ownerId");
  const routeId = formNumber(formData, "routeId");
  const attemptDate = formString(formData, "attemptDate");
  const result = formString(formData, "result") as LogbookEntryResult;
  const notes = formString(formData, "notes");
  if (!id || !ownerId || !routeId || !attemptDate || !result) {
    return validationError("missingLogbookData");
  }

  try {
    await updateLogbookEntry(
      id,
      { userId: ownerId, routeId, attemptDate, result, notes: notes || null },
      session.token,
    );
  } catch (error) {
    return errorState(error);
  }

  revalidatePath(`/routes/${routeId}`);
  revalidatePath("/logbook");
  return { success: true };
}

export async function deleteLogbookEntryAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const id = formNumber(formData, "id");
  if (!id) {
    return validationError("missingLogbookEntry");
  }

  try {
    await deleteLogbookEntry(id, session.token);
  } catch (error) {
    return errorState(error);
  }

  revalidatePath("/logbook");
  return { success: true };
}

// --- Route lists ---

export async function createRouteListAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const name = formString(formData, "name");
  const description = formString(formData, "description");
  const isPublic = formData.get("isPublic") === "on";
  if (!name) {
    return validationError("listNameRequired");
  }

  try {
    await createRouteList(
      { userId: session.userId, name, description: description || null, isPublic },
      session.token,
    );
  } catch (error) {
    return errorState(error);
  }

  revalidatePath("/lists");
  return { success: true };
}

export async function updateRouteListAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const id = formNumber(formData, "id");
  const ownerId = formNumber(formData, "ownerId");
  const name = formString(formData, "name");
  const description = formString(formData, "description");
  const isPublic = formData.get("isPublic") === "on";
  if (!id || !ownerId || !name) {
    return validationError("missingListData");
  }

  try {
    await updateRouteList(
      id,
      { userId: ownerId, name, description: description || null, isPublic },
      session.token,
    );
  } catch (error) {
    return errorState(error);
  }

  revalidatePath("/lists");
  revalidatePath(`/lists/${id}`);
  return { success: true };
}

export async function deleteRouteListAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const id = formNumber(formData, "id");
  if (!id) {
    return validationError("missingList");
  }

  try {
    await deleteRouteList(id, session.token);
  } catch (error) {
    return errorState(error);
  }

  revalidatePath("/lists");
  return { success: true };
}

export async function addRouteToListAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const listId = formNumber(formData, "listId");
  const routeId = formNumber(formData, "routeId");
  if (!listId || !routeId) {
    return validationError("missingListOrRoute");
  }

  try {
    await upsertListRoute({ listId, routeId }, session.token);
  } catch (error) {
    return errorState(error);
  }

  revalidatePath(`/lists/${listId}`);
  revalidatePath(`/routes/${routeId}`);
  return { success: true };
}

export async function removeRouteFromListAction(
  _prevState: PersonalFormState | undefined,
  formData: FormData,
): Promise<PersonalFormState> {
  const session = await verifySession();
  const listId = formNumber(formData, "listId");
  const routeId = formNumber(formData, "routeId");
  if (!listId || !routeId) {
    return validationError("missingListOrRoute");
  }

  try {
    await deleteListRoute(listId, routeId, session.token);
  } catch (error) {
    return errorState(error);
  }

  revalidatePath(`/lists/${listId}`);
  return { success: true };
}
