"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ApiError,
  createCatalogItem,
  deleteCatalogItem,
  setCatalogItemVerified,
  updateCatalogItem,
  type CatalogKind,
  type CatalogRequest,
} from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { validationError, type ValidationErrorKey } from "@/i18n/validation-error";
import { isSafeInternalPath } from "@/lib/url";
import {
  parseCragForm,
  parsePitchForm,
  parseSectorForm,
  parseZoneForm,
  parseRouteForm,
  type FieldErrors,
  type ParseResult,
} from "./forms";

export interface CatalogFormState {
  error?: string;
  fieldErrors?: FieldErrors;
  /** What was submitted, so a failed save doesn't wipe the form (React resets forms after an action). */
  values?: Record<string, string>;
}

function submittedValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$ACTION")) {
      values[key] = value;
    }
  });
  return values;
}

const CATALOG_KINDS: readonly CatalogKind[] = ["zone", "crag", "sector", "route", "pitch"];

function isCatalogKind(value: unknown): value is CatalogKind {
  return typeof value === "string" && (CATALOG_KINDS as readonly string[]).includes(value);
}

function formId(formData: FormData, key = "id"): number | null {
  const value = Number(formData.get(key));
  return Number.isInteger(value) && value > 0 ? value : null;
}

/** Turns API failures into a message in the visitor's language. */
async function apiErrorState(error: unknown, conflictKey: ValidationErrorKey): Promise<CatalogFormState> {
  if (!(error instanceof ApiError)) {
    throw error;
  }
  if (error.status === 401) {
    redirect("/login");
  }
  if (error.status === 403) {
    return validationError("catalogForbidden");
  }
  if (error.status === 404) {
    return validationError("catalogNotFound");
  }
  if (error.status === 409) {
    return validationError(conflictKey);
  }
  return { error: error.message };
}

/**
 * Shared create-or-update flow: parse, send, then go to the saved item's page.
 * `redirect` must run outside the try block (it works by throwing).
 */
async function saveItem<K extends CatalogKind, V>(
  kind: K,
  formData: FormData,
  parsed: ParseResult<V>,
  toRequest: (value: V) => CatalogRequest<K>,
  afterCreate: (savedId: number, value: V, token: string) => Promise<void>,
  pathFor: (savedId: number, value: V) => string,
): Promise<CatalogFormState> {
  if (!parsed.ok) {
    return { fieldErrors: parsed.errors, values: submittedValues(formData) };
  }
  const session = await verifySession();
  const id = formId(formData);

  let savedId: number;
  try {
    const request = toRequest(parsed.value);
    const saved = id
      ? await updateCatalogItem(kind, id, request, session.token)
      : await createCatalogItem(kind, request, session.token);
    savedId = saved.id;
  } catch (error) {
    const state = await apiErrorState(error, kind === "pitch" ? "pitchOrderTaken" : "catalogConflict");
    return { ...state, values: submittedValues(formData) };
  }

  if (!id) {
    try {
      await afterCreate(savedId, parsed.value, session.token);
    } catch (error) {
      // The item itself is saved; sending the user back to the form would create a duplicate.
      console.error(`Saved ${kind} ${savedId}, but the follow-up step failed`, error);
    }
  }

  const path = pathFor(savedId, parsed.value);
  revalidatePath(path);
  redirect(path);
}

const nothingAfterCreate = async (): Promise<void> => {};

export async function saveZoneAction(_prev: CatalogFormState, formData: FormData): Promise<CatalogFormState> {
  return saveItem("zone", formData, parseZoneForm(formData), (value) => value, nothingAfterCreate, (id) => `/zones/${id}`);
}

export async function saveCragAction(_prev: CatalogFormState, formData: FormData): Promise<CatalogFormState> {
  return saveItem("crag", formData, parseCragForm(formData), (value) => value, nothingAfterCreate, (id) => `/crags/${id}`);
}

export async function saveSectorAction(_prev: CatalogFormState, formData: FormData): Promise<CatalogFormState> {
  return saveItem(
    "sector",
    formData,
    parseSectorForm(formData),
    (value) => value,
    nothingAfterCreate,
    (id) => `/sectors/${id}`,
  );
}

/** A new route can be given its grade and length straight away; they become pitch 1. */
export async function saveRouteAction(_prev: CatalogFormState, formData: FormData): Promise<CatalogFormState> {
  return saveItem(
    "route",
    formData,
    parseRouteForm(formData),
    (value) => value.route,
    async (routeId, value, token) => {
      if (value.firstPitch) {
        await createCatalogItem(
          "pitch",
          { routeId, orderIndex: 1, boltsCount: null, description: null, ...value.firstPitch },
          token,
        );
      }
    },
    (id) => `/routes/${id}`,
  );
}

export async function savePitchAction(_prev: CatalogFormState, formData: FormData): Promise<CatalogFormState> {
  return saveItem(
    "pitch",
    formData,
    parsePitchForm(formData),
    (value) => value,
    nothingAfterCreate,
    (_id, value) => `/routes/${value.routeId}`,
  );
}

export async function deleteCatalogItemAction(
  _prev: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const kind = formData.get("kind");
  const id = formId(formData);
  const redirectTo = String(formData.get("redirectTo") ?? "");
  if (!isCatalogKind(kind) || !id || !isSafeInternalPath(redirectTo)) {
    return validationError("catalogNotFound");
  }
  const session = await verifySession();

  try {
    await deleteCatalogItem(kind, id, session.token);
  } catch (error) {
    return apiErrorState(error, "catalogInUse");
  }

  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function setVerificationAction(
  _prev: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const kind = formData.get("kind");
  const id = formId(formData);
  const verified = formData.get("verified") === "true";
  const pagePath = String(formData.get("pagePath") ?? "");
  if (!isCatalogKind(kind) || !id || !isSafeInternalPath(pagePath)) {
    return validationError("catalogNotFound");
  }
  const session = await verifySession();

  try {
    await setCatalogItemVerified(kind, id, verified, session.token);
  } catch (error) {
    return apiErrorState(error, "catalogConflict");
  }

  revalidatePath(pagePath);
  return {};
}

