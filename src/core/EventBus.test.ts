import { describe, it, expect, vi } from "vitest";
import EventBus from "./EventBus";

describe("EventBus", () => {
  it("вызывает обработчик при emit с аргументами", () => {
    const bus = new EventBus<string>();
    const handler = vi.fn();
    bus.on("test", handler);
    bus.emit("test", 42);
    expect(handler).toHaveBeenCalledWith(42);
  });

  it("не вызывает обработчик после off()", () => {
    const bus = new EventBus<string>();
    const handler = vi.fn();
    bus.on("test", handler);
    bus.off("test", handler);
    bus.emit("test");
    expect(handler).not.toHaveBeenCalled();
  });

  it("вызывает несколько обработчиков одного события", () => {
    const bus = new EventBus<string>();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.on("test", h1);
    bus.on("test", h2);
    bus.emit("test");
    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledTimes(1);
  });

  it("не выбрасывает ошибку при emit без подписчиков", () => {
    const bus = new EventBus<string>();
    expect(() => bus.emit("no-listeners")).not.toThrow();
  });

  it("удаляет только указанный обработчик, оставляя остальные", () => {
    const bus = new EventBus<string>();
    const keep = vi.fn();
    const remove = vi.fn();
    bus.on("test", keep);
    bus.on("test", remove);
    bus.off("test", remove);
    bus.emit("test");
    expect(keep).toHaveBeenCalledTimes(1);
    expect(remove).not.toHaveBeenCalled();
  });
});
