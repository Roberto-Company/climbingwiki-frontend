import { API_BASE_URL } from "./config";
import { ApiError, type ValidationErrors } from "./errors";

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

function isMessageBody(data: unknown): data is { message: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  );
}

async function parseErrorBody(
  response: Response,
): Promise<{ message: string; validationErrors?: ValidationErrors }> {
  const data: unknown = await response.json().catch(() => null);

  if (isMessageBody(data)) {
    return { message: data.message };
  }

  if (typeof data === "object" && data !== null) {
    const validationErrors = data as ValidationErrors;
    const firstMessage = Object.values(validationErrors)[0];
    return {
      message: typeof firstMessage === "string" ? firstMessage : response.statusText,
      validationErrors,
    };
  }

  return { message: response.statusText };
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const { message, validationErrors } = await parseErrorBody(response);
    throw new ApiError(response.status, message, validationErrors);
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
