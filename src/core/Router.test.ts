import { describe, it, expect, beforeEach } from "vitest";
import Router from "./Router";
import Block from "./Block";

class StubBlock extends Block {
  protected template = '<div class="stub"></div>';
}

const ROOT = "#app";

beforeEach(() => {
  document.body.innerHTML = `<div id="app"></div>`;
  window.history.replaceState({}, "", "/");
});

describe("Router", () => {
  it("рендерит компонент зарегистрированного маршрута", () => {
    const router = new Router(ROOT);
    router.use("/", () => new StubBlock());
    router.start();
    expect(document.querySelector(".stub")).not.toBeNull();
  });

  it("рендерит fallback для незарегистрированного маршрута", () => {
    window.history.replaceState({}, "", "/unknown");
    const router = new Router(ROOT);
    router.setFallback(() => new StubBlock());
    router.start();
    expect(document.querySelector(".stub")).not.toBeNull();
  });

  it("go() обновляет pathname и рендерит нужный маршрут", () => {
    const router = new Router(ROOT);
    router.use("/", () => new StubBlock());
    router.use("/about", () => new StubBlock());
    router.start();
    router.go("/about");
    expect(window.location.pathname).toBe("/about");
  });

  it("go() не делает pushState, если уже на этом маршруте", () => {
    const router = new Router(ROOT);
    router.use("/", () => new StubBlock());
    router.start();
    const before = window.history.length;
    router.go("/");
    expect(window.history.length).toBe(before);
  });

  it("guard перенаправляет на указанный путь", () => {
    window.history.replaceState({}, "", "/protected");
    const router = new Router(ROOT);
    router.use("/", () => new StubBlock());
    router.use("/protected", () => new StubBlock());
    router.setGuard((path) => (path === "/protected" ? "/" : null));
    router.start();
    expect(window.location.pathname).toBe("/");
  });

  it("guard пропускает навигацию, возвращая null", () => {
    const router = new Router(ROOT);
    router.use("/", () => new StubBlock());
    router.setGuard(() => null);
    router.start();
    expect(window.location.pathname).toBe("/");
    expect(document.querySelector(".stub")).not.toBeNull();
  });

  it("Route.match возвращает true только для точного совпадения", () => {
    const router = new Router(ROOT);
    router.use("/exact", () => new StubBlock());
    router.setFallback(() => {
      const b = new StubBlock();
      return b;
    });
    window.history.replaceState({}, "", "/exact-plus");
    router.start();
    expect(window.location.pathname).toBe("/exact-plus");
  });
});
