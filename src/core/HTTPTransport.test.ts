import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  HTTPTransport,
  UnauthorizedError,
  NetworkError,
  ApiError,
} from "./HTTPTransport";

interface MockXhr {
  open: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
  setRequestHeader: ReturnType<typeof vi.fn>;
  getResponseHeader: ReturnType<typeof vi.fn>;
  withCredentials: boolean;
  timeout: number;
  status: number;
  responseText: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  ontimeout: (() => void) | null;
  onabort: (() => void) | null;
}

let xhr: MockXhr;

beforeEach(() => {
  xhr = {
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
    getResponseHeader: vi.fn().mockReturnValue("application/json"),
    withCredentials: false,
    timeout: 0,
    status: 200,
    responseText: "{}",
    onload: null,
    onerror: null,
    ontimeout: null,
    onabort: null,
  };
  vi.stubGlobal("XMLHttpRequest", function XhrMock(this: object) {
    return xhr;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Вспомогательная функция — запускает запрос и сразу «отвечает» через onload
function respond<T>(fn: () => Promise<T>): Promise<T> {
  const promise = fn();
  xhr.onload?.();
  return promise;
}

describe("HTTPTransport", () => {
  const http = new HTTPTransport("https://api.test");

  describe("GET", () => {
    it("использует метод GET без тела", async () => {
      await respond(() => http.get("/ping"));
      expect(xhr.open).toHaveBeenCalledWith("GET", "https://api.test/ping");
      expect(xhr.send).toHaveBeenCalledWith();
    });

    it("добавляет query-параметры к URL", async () => {
      await respond(() => http.get("/search", { q: "hello", page: "2" }));
      const url = String(xhr.open.mock.calls[0]?.[1]);
      expect(url).toContain("q=hello");
      expect(url).toContain("page=2");
    });

    it("парсит JSON-ответ", async () => {
      xhr.responseText = JSON.stringify({ id: 1, name: "Alice" });
      const result = await respond(() =>
        http.get<{ id: number; name: string }>("/user"),
      );
      expect(result).toEqual({ id: 1, name: "Alice" });
    });
  });

  describe("POST", () => {
    it("отправляет JSON-тело с Content-Type", async () => {
      await respond(() => http.post("/data", { key: "value" }));
      expect(xhr.open).toHaveBeenCalledWith("POST", "https://api.test/data");
      expect(xhr.setRequestHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json",
      );
      expect(xhr.send).toHaveBeenCalledWith(JSON.stringify({ key: "value" }));
    });
  });

  describe("PUT", () => {
    it("использует метод PUT", async () => {
      await respond(() => http.put("/item", { x: 1 }));
      expect(xhr.open).toHaveBeenCalledWith("PUT", "https://api.test/item");
    });
  });

  describe("DELETE", () => {
    it("использует метод DELETE", async () => {
      await respond(() => http.delete("/item"));
      expect(xhr.open).toHaveBeenCalledWith("DELETE", "https://api.test/item");
    });
  });

  describe("Ошибки", () => {
    it("бросает UnauthorizedError на 401", async () => {
      xhr.status = 401;
      xhr.responseText = JSON.stringify({ reason: "Not authorized" });
      await expect(
        respond(() => http.get("/protected")),
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("бросает ApiError с правильным статусом", async () => {
      xhr.status = 500;
      xhr.responseText = JSON.stringify({ reason: "Internal error" });
      const err = await respond(() => http.get("/broken")).catch(
        (e: unknown) => e,
      );
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(500);
    });

    it("бросает NetworkError при обрыве соединения", async () => {
      const promise = http.get("/fail");
      xhr.onerror?.();
      await expect(promise).rejects.toBeInstanceOf(NetworkError);
    });

    it("устанавливает withCredentials = true", async () => {
      respond(() => http.get("/me")).catch(() => undefined);
      expect(xhr.withCredentials).toBe(true);
    });
  });
});
