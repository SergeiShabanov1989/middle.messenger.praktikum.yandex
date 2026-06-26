import { describe, it, expect, vi } from "vitest";
import Store from "./Store";

describe("Store", () => {
  it("возвращает начальное состояние", () => {
    const store = new Store({ count: 0 });
    expect(store.getState()).toEqual({ count: 0 });
  });

  it("merges patch, не затрагивая остальные поля", () => {
    const store = new Store({ a: 1, b: 2 });
    store.set({ a: 10 });
    expect(store.getState()).toEqual({ a: 10, b: 2 });
  });

  it("уведомляет подписчика при set()", () => {
    const store = new Store({ value: "initial" });
    const listener = vi.fn();
    store.subscribe(listener);
    store.set({ value: "updated" });
    expect(listener).toHaveBeenCalledWith({ value: "updated" });
  });

  it("не вызывает подписчика после отписки", () => {
    const store = new Store({ x: 0 });
    const listener = vi.fn();
    const unsub = store.subscribe(listener);
    unsub();
    store.set({ x: 1 });
    expect(listener).not.toHaveBeenCalled();
  });

  it("уведомляет несколько подписчиков", () => {
    const store = new Store({ n: 0 });
    const l1 = vi.fn();
    const l2 = vi.fn();
    store.subscribe(l1);
    store.subscribe(l2);
    store.set({ n: 1 });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });
});
