/**
 * Mirrors GlobalExceptionHandler in BackendApi: every non-2xx response is either
 * `ApiError(message: string)` or, for @Valid failures, a `Map<field, message>`.
 */
export type ValidationErrors = Record<string, string>;

export class ApiError extends Error {
  readonly status: number;
  readonly validationErrors?: ValidationErrors;

  constructor(status: number, message: string, validationErrors?: ValidationErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}
