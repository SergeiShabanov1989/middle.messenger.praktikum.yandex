import { describe, it, expect, vi } from "vitest";
import Input from "./Input";

describe("Input", () => {
  it("рендерит с правильным name", () => {
    const input = new Input({ name: "email" });
    expect((input.element() as HTMLInputElement).name).toBe("email");
  });

  it("выставляет placeholder", () => {
    const input = new Input({ name: "login", placeholder: "Введите логин" });
    expect((input.element() as HTMLInputElement).placeholder).toBe(
      "Введите логин",
    );
  });

  it('по умолчанию type="text"', () => {
    const input = new Input({ name: "field" });
    expect((input.element() as HTMLInputElement).type).toBe("text");
  });

  it("выставляет кастомный type", () => {
    const input = new Input({ name: "pass", type: "password" });
    expect((input.element() as HTMLInputElement).type).toBe("password");
  });

  it("value() возвращает текущее значение", () => {
    const input = new Input({ name: "test" });
    (input.element() as HTMLInputElement).value = "hello";
    expect(input.value()).toBe("hello");
  });

  it("name() возвращает имя поля", () => {
    const input = new Input({ name: "username" });
    expect(input.name()).toBe("username");
  });

  it("вызывает onBlur при потере фокуса", () => {
    const onBlur = vi.fn();
    const input = new Input({ name: "field", onBlur });
    (input.element() as HTMLInputElement).dispatchEvent(new Event("blur"));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("выставляет disabled", () => {
    const input = new Input({ name: "locked", disabled: true });
    expect((input.element() as HTMLInputElement).disabled).toBe(true);
  });
});
