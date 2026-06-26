const API_BASE = "https://ya-praktikum.tech/api/v2";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  data?: Record<string, unknown> | FormData;
  timeout?: number;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly reason: string;

  constructor(status: number, reason: string) {
    super(reason);
    this.status = status;
    this.reason = reason;
    this.name = "ApiError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(reason = "Необходима авторизация") {
    super(401, reason);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(reason = "Доступ запрещён") {
    super(403, reason);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(reason = "Ресурс не найден") {
    super(404, reason);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(reason: string) {
    super(400, reason);
    this.name = "ValidationError";
  }
}

export class ConflictError extends ApiError {
  constructor(reason: string) {
    super(409, reason);
    this.name = "ConflictError";
  }
}

export class NetworkError extends Error {
  constructor() {
    super("Ошибка сети");
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`Превышено время ожидания (${timeout} мс)`);
    this.name = "TimeoutError";
  }
}

function queryStringify(data: Record<string, unknown>): string {
  const entries = Object.entries(data).filter(
    ([, v]) => v !== undefined && v !== null,
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join("&")
  );
}

function parseApiError(status: number, body: string): ApiError {
  let reason = "Неизвестная ошибка";
  try {
    const json = JSON.parse(body) as { reason?: string };
    if (json.reason) reason = json.reason;
  } catch {}

  switch (status) {
    case 400:
      return new ValidationError(reason);
    case 401:
      return new UnauthorizedError(reason);
    case 403:
      return new ForbiddenError(reason);
    case 404:
      return new NotFoundError(reason);
    case 409:
      return new ConflictError(reason);
    default:
      return new ApiError(status, reason);
  }
}

export class HTTPTransport {
  private readonly base: string;

  constructor(base: string = API_BASE) {
    this.base = base;
  }

  public get<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, { data });
  }

  public post<T>(
    path: string,
    data?: Record<string, unknown> | FormData,
  ): Promise<T> {
    return this.request<T>("POST", path, { data });
  }

  public put<T>(
    path: string,
    data?: Record<string, unknown> | FormData,
  ): Promise<T> {
    return this.request<T>("PUT", path, { data });
  }

  public delete<T>(path: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>("DELETE", path, { data });
  }

  private request<T>(
    method: Method,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { data, timeout = 5000 } = options;
    const isGet = method === "GET";

    const url =
      isGet && data && !(data instanceof FormData)
        ? this.base + path + queryStringify(data as Record<string, unknown>)
        : this.base + path;

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.withCredentials = true;
      xhr.timeout = timeout;

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const ct = xhr.getResponseHeader("Content-Type") ?? "";
            resolve(
              ct.includes("application/json")
                ? (JSON.parse(xhr.responseText) as T)
                : (xhr.responseText as unknown as T),
            );
          } catch {
            resolve(xhr.responseText as unknown as T);
          }
        } else {
          reject(parseApiError(xhr.status, xhr.responseText));
        }
      };

      xhr.onerror = () => reject(new NetworkError());
      xhr.onabort = () => reject(new NetworkError());
      xhr.ontimeout = () => reject(new TimeoutError(timeout));

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
      }
    });
  }
}

export default new HTTPTransport();
