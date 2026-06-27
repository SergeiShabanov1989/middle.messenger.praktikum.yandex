import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("рендерит переданный label", () => {
    const btn = new Button({ label: "Нажми меня" });
    expect(btn.element()?.textContent?.trim()).toBe("Нажми меня");
  });

  it("выставляет переданный type", () => {
    const btn = new Button({ label: "OK", type: "submit" });
    expect((btn.element() as HTMLButtonElement).type).toBe("submit");
  });

  it('по умолчанию type="button"', () => {
    const btn = new Button({ label: "Default" });
    expect((btn.element() as HTMLButtonElement).type).toBe("button");
  });

  it("выставляет disabled когда disabled=true", () => {
    const btn = new Button({ label: "Locked", disabled: true });
    expect((btn.element() as HTMLButtonElement).disabled).toBe(true);
  });

  it("не выставляет disabled по умолчанию", () => {
    const btn = new Button({ label: "Active" });
    expect((btn.element() as HTMLButtonElement).disabled).toBe(false);
  });

  it("вызывает onClick при клике", () => {
    const onClick = vi.fn();
    const btn = new Button({ label: "Кликни", onClick });
    (btn.element() as HTMLButtonElement).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("содержит класс button", () => {
    const btn = new Button({ label: "Style" });
    expect(btn.element()?.classList.contains("button")).toBe(true);
  });
});
