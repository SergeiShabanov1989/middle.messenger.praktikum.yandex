import Handlebars from "handlebars";

export interface BlockChildEntry {
  component: Block;
  embed(node: DocumentFragment): void;
}

export interface BlockOwnProps {
  __children?: BlockChildEntry[];
  __refs?: Record<string, Element>;
}

export type BlockEventMap = Partial<{
  [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
}>;

export default abstract class Block<
  Props extends BlockOwnProps = BlockOwnProps,
> {
  protected abstract template: string;

  protected props: Props;

  private domElement: Element | null = null;

  protected children: Block[] = [];

  protected refs: Record<string, Element> = {};

  protected events: BlockEventMap = {};

  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }
    return this.domElement;
  }

  public setProps(next: Partial<Props>): void {
    this.props = {
      ...this.props,
      ...next,
      __children: [],
      __refs: {},
    } as Props;
    this.render();
  }

  protected componentDidMount(): void {}

  protected componentWillUnmount(): void {}

  protected dispatchComponentDidMount(): void {
    this.attachListeners();
    this.componentDidMount();
    this.children.forEach((child) => child.dispatchComponentDidMount());
  }

  private dispatchComponentWillUnmount(): void {
    if (!this.domElement) return;
    [...this.children]
      .reverse()
      .forEach((child) => child.dispatchComponentWillUnmount());
    this.componentWillUnmount();
    this.removeListeners();
  }

  private attachListeners(): void {
    const node = this.domElement;
    if (!node) return;
    (Object.keys(this.events) as Array<keyof HTMLElementEventMap>).forEach(
      (eventName) => {
        const listener = this.events[eventName] as EventListener | undefined;
        if (listener) {
          node.addEventListener(eventName, listener);
        }
      },
    );
  }

  private removeListeners(): void {
    const node = this.domElement;
    if (!node) return;
    (Object.keys(this.events) as Array<keyof HTMLElementEventMap>).forEach(
      (eventName) => {
        const listener = this.events[eventName] as EventListener | undefined;
        if (listener) {
          node.removeEventListener(eventName, listener);
        }
      },
    );
  }

  protected render(): void {
    this.dispatchComponentWillUnmount();

    const next = this.compile();
    if (this.domElement && next) {
      this.domElement.replaceWith(next);
    }
    this.domElement = next;

    this.attachListeners();
    this.componentDidMount();
  }

  private compile(): Element | null {
    const compiled = Handlebars.compile(this.template);
    const html = compiled(this.props);
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    const fragment = tpl.content;

    const childEntries = this.props.__children ?? [];
    this.children = childEntries.map((entry) => entry.component);
    childEntries.forEach((entry) => entry.embed(fragment));

    const initialRefs = this.props.__refs ?? {};
    this.refs = Array.from(
      fragment.querySelectorAll<HTMLElement>("[ref]"),
    ).reduce<Record<string, Element>>(
      (acc, element) => {
        const key = element.getAttribute("ref");
        if (key) {
          acc[key] = element;
          element.removeAttribute("ref");
        }
        return acc;
      },
      { ...initialRefs },
    );

    return fragment.firstElementChild;
  }
}
