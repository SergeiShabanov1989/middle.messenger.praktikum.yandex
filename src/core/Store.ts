import EventBus from "./EventBus";

type StoreEvent = "changed";

export default class Store<State extends object> {
  private state: State;

  private bus = new EventBus<StoreEvent>();

  constructor(initial: State) {
    this.state = initial;
  }

  public getState(): State {
    return this.state;
  }

  public set(patch: Partial<State>): void {
    this.state = { ...this.state, ...patch };
    this.bus.emit("changed", this.state);
  }

  public subscribe(listener: (state: State) => void): () => void {
    const handler = (...args: unknown[]) => {
      listener(args[0] as State);
    };
    this.bus.on("changed", handler);
    return () => this.bus.off("changed", handler);
  }
}
