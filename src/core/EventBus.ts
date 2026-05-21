type EventHandler = (...args: unknown[]) => void;

export default class EventBus<E extends string = string> {
  private listeners: Partial<Record<E, EventHandler[]>> = {};

  public on(event: E, callback: EventHandler): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  public off(event: E, callback: EventHandler): void {
    const list = this.listeners[event];
    if (!list) return;
    this.listeners[event] = list.filter((cb) => cb !== callback);
  }

  public emit(event: E, ...args: unknown[]): void {
    const list = this.listeners[event];
    if (!list) return;
    list.forEach((cb) => cb(...args));
  }
}
