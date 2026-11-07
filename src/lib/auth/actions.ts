"use server";

import { validationError } from "@/i18n/validation-error";
import { redirect } from "next/navigation";
import { apiFetch, ApiError, type ValidationErrors } from "@/lib/api";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  UserRequest,
  UserResponse,
  VerifyEmailRequest,
} from "@/lib/types";
import { clientIpHeaders } from "./client-ip";
import { createSession, deleteSession } from "./session";

export interface FormState {
  error?: string;
  fieldErrors?: ValidationErrors;
  success?: boolean;
}

export async function loginAction(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return validationError("loginRequired");
  }

  try {
    const data = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      headers: await clientIpHeaders(),
      body: { username, password } satisfies LoginRequest,
    });
    await createSession({
      token: data.token,
      userId: data.userId,
      username: data.username,
      role: data.role,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, fieldErrors: error.validationErrors };
    }
    throw error;
  }

  redirect("/profile");
}

export async function registerAction(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!username || !email || !password) {
    return validationError("registerRequired");
  }

  try {
    await apiFetch<UserResponse>("/auth/register", {
      method: "POST",
      body: {
        username,
        email,
        password,
        fullName: fullName || null,
        bio: null,
        avatarUrl: null,
        role: null,
      } satisfies UserRequest,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, fieldErrors: error.validationErrors };
    }
    throw error;
  }

  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

export async function verifyEmailAction(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const token = String(formData.get("token") ?? "").trim();

  if (!token) {
    return validationError("verifyTokenRequired");
  }

  try {
    await apiFetch<void>("/auth/verify-email", {
      method: "POST",
      body: { token } satisfies VerifyEmailRequest,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, fieldErrors: error.validationErrors };
    }
    throw error;
  }

  return { success: true };
}

export async function forgotPasswordAction(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return validationError("emailRequired");
  }

  try {
    // The API answers 204 whether or not the email is registered; the link arrives by email.
    await apiFetch<void>("/auth/forgot-password", {
      method: "POST",
      headers: await clientIpHeaders(),
      body: { email } satisfies ForgotPasswordRequest,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, fieldErrors: error.validationErrors };
    }
    throw error;
  }
}

export async function resetPasswordAction(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const token = String(formData.get("token") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!token || !newPassword) {
    return validationError("resetRequired");
  }

  try {
    await apiFetch<void>("/auth/reset-password", {
      method: "POST",
      body: { token, newPassword } satisfies ResetPasswordRequest,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message, fieldErrors: error.validationErrors };
    }
    throw error;
  }

  redirect("/login?reset=1");
}
