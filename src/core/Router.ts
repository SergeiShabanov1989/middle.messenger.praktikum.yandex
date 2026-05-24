import type Block from "./Block";

export type PageFactory = () => Block;

interface Route {
  pathname: string;
  factory: PageFactory;
}

export default class Router {
  private routes: Route[] = [];

  private fallback: PageFactory | null = null;

  private readonly rootSelector: string;

  constructor(rootSelector: string) {
    this.rootSelector = rootSelector;
  }

  public use(pathname: string, factory: PageFactory): this {
    this.routes.push({ pathname, factory });
    return this;
  }

  public setFallback(factory: PageFactory): this {
    this.fallback = factory;
    return this;
  }

  public start(): void {
    window.addEventListener("popstate", () => {
      this.renderCurrent();
    });
    document.addEventListener("click", this.handleLinkClick);
    this.renderCurrent();
  }

  public go(pathname: string): void {
    if (window.location.pathname === pathname) return;
    window.history.pushState({}, "", pathname);
    this.renderCurrent();
  }

  private handleLinkClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    if (!target) return;
    const anchor = target.closest("a");
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target === "_blank") return;
    if (anchor.hasAttribute("download")) return;
    if (anchor.dataset["external"] === "true") return;

    const href = anchor.getAttribute("href");
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    event.preventDefault();
    this.go(href);
  };

  private renderCurrent(): void {
    const { pathname } = window.location;
    const route = this.routes.find((r) => r.pathname === pathname);
    const factory = route?.factory ?? this.fallback;
    if (!factory) {
      return;
    }

    const root = document.querySelector(this.rootSelector);
    if (!root) {
      throw new Error(`Router: корневой элемент "${this.rootSelector}" не найден`);
    }

    const block = factory();
    const element = block.element();
    root.replaceChildren();
    if (element) {
      root.appendChild(element);
    }
  }
}
