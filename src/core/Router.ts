import type Block from "./Block";

export type PageFactory = () => Block;

export type AuthGuard = (pathname: string) => string | null;

class Route {
  private readonly pathname: string;
  private readonly factory: PageFactory;
  private readonly rootQuery: string;
  private block: Block | null = null;

  constructor(pathname: string, factory: PageFactory, rootQuery: string) {
    this.pathname = pathname;
    this.factory = factory;
    this.rootQuery = rootQuery;
  }

  public navigate(pathname: string): void {
    if (this.match(pathname)) {
      this.render();
    }
  }

  public leave(): void {
    if (this.block) {
      this.block.hide();
    }
  }

  public match(pathname: string): boolean {
    return this.pathname === "*" || pathname === this.pathname;
  }

  public render(): void {
    const root = document.querySelector(this.rootQuery);
    if (!root) {
      throw new Error(`Router: корневой элемент "${this.rootQuery}" не найден`);
    }

    root.replaceChildren();

    if (!this.block) {
      this.block = this.factory();
    }

    const element = this.block.element();
    if (element) {
      root.appendChild(element);
      this.block.show();
    }
  }
}

export default class Router {
  private routes: Route[] = [];

  private currentRoute: Route | null = null;

  private fallback: Route | null = null;

  private guard: AuthGuard | null = null;

  private readonly rootSelector: string;

  constructor(rootSelector: string) {
    this.rootSelector = rootSelector;
  }

  public use(pathname: string, factory: PageFactory): this {
    this.routes.push(new Route(pathname, factory, this.rootSelector));
    return this;
  }

  public setFallback(factory: PageFactory): this {
    this.fallback = new Route("*", factory, this.rootSelector);
    return this;
  }

  public setGuard(guard: AuthGuard): this {
    this.guard = guard;
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

    if (this.guard) {
      const redirect = this.guard(pathname);
      if (redirect !== null && redirect !== pathname) {
        window.history.replaceState({}, "", redirect);
        this.renderCurrent();
        return;
      }
    }

    const nextRoute =
      this.routes.find((r) => r.match(pathname)) ?? this.fallback;

    if (!nextRoute) return;

    if (this.currentRoute && this.currentRoute !== nextRoute) {
      this.currentRoute.leave();
    }

    this.currentRoute = nextRoute;
    nextRoute.navigate(pathname);
  }
}
