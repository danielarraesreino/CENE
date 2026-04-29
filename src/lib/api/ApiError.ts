/**
 * ApiError — Classe padronizada para erros de API no ecossistema Reibb.
 * Alinhado com o docs/ERROR_HANDLING_GUIDE.md
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    public status: number,
    public isRetryable: boolean = false,
    public details: unknown = null
  ) {
    super(userMessage);
    this.name = "ApiError";
  }

  static fromResponse(data: unknown, status: number): ApiError {
    const errorData = (data && typeof data === 'object' && 'error' in data) 
      ? (data as { error: Record<string, unknown> }).error 
      : {} as Record<string, unknown>;

    return new ApiError(
      String(errorData.code || "INTERNAL_ERROR"),
      String(errorData.message || "Ocorreu um erro inesperado."),
      status,
      Boolean(errorData.retryable || status >= 500),
      errorData.details
    );
  }

  toJSON() {
    return {
      code: this.code,
      message: this.userMessage,
      status: this.status,
      details: this.details,
      retryable: this.isRetryable,
    };
  }
}
