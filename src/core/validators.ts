export type FieldName =
  | "first_name"
  | "second_name"
  | "login"
  | "email"
  | "password"
  | "password_confirm"
  | "old_password"
  | "new_password"
  | "phone"
  | "display_name"
  | "message";

export interface ValidationResult {
  valid: boolean;
  message: string;
}

const NAME_REGEX = /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/;
const LOGIN_REGEX = /^(?=.*[A-Za-z_-])[A-Za-z0-9_-]{3,20}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z][A-Za-z0-9.-]*$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,40}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;

const REQUIRED_MESSAGE = "Поле обязательно для заполнения";

const RULES: Record<FieldName, (value: string) => ValidationResult> = {
  first_name: (value) =>
    NAME_REGEX.test(value)
      ? ok()
      : fail("Латиница или кириллица, с заглавной буквы, без пробелов и цифр"),

  second_name: (value) =>
    NAME_REGEX.test(value)
      ? ok()
      : fail("Латиница или кириллица, с заглавной буквы, без пробелов и цифр"),

  login: (value) =>
    LOGIN_REGEX.test(value)
      ? ok()
      : fail("3–20 символов, латиница, не только из цифр"),

  email: (value) =>
    EMAIL_REGEX.test(value) ? ok() : fail("Введите корректный email"),

  password: (value) =>
    PASSWORD_REGEX.test(value)
      ? ok()
      : fail("8–40 символов, минимум одна заглавная буква и одна цифра"),

  password_confirm: (value) =>
    PASSWORD_REGEX.test(value)
      ? ok()
      : fail("8–40 символов, минимум одна заглавная буква и одна цифра"),

  old_password: (value) =>
    PASSWORD_REGEX.test(value)
      ? ok()
      : fail("8–40 символов, минимум одна заглавная буква и одна цифра"),

  new_password: (value) =>
    PASSWORD_REGEX.test(value)
      ? ok()
      : fail("8–40 символов, минимум одна заглавная буква и одна цифра"),

  phone: (value) =>
    PHONE_REGEX.test(value)
      ? ok()
      : fail("10–15 цифр, может начинаться с плюса"),

  display_name: (value) =>
    value.trim().length > 0 ? ok() : fail(REQUIRED_MESSAGE),

  message: (value) =>
    value.trim().length > 0 ? ok() : fail("Сообщение не должно быть пустым"),
};

function ok(): ValidationResult {
  return { valid: true, message: "" };
}

function fail(message: string): ValidationResult {
  return { valid: false, message };
}

export function validateField(name: string, value: string): ValidationResult {
  const rule = RULES[name as FieldName];
  if (!rule) {
    return ok();
  }
  if (value.length === 0) {
    return fail(REQUIRED_MESSAGE);
  }
  return rule(value);
}

export function isKnownField(name: string): name is FieldName {
  return name in RULES;
}
