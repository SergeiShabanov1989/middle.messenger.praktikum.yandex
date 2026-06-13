import Form, { type FormProps } from "../../components/form/Form";
import AuthController from "../../controllers/AuthController";
import { ApiError } from "../../core/HTTPTransport";
import "./sign-up.scss";
import "./modules/register/register.scss";

interface SignUpPageProps extends FormProps {
  error?: string;
}

export default class SignUpPage extends Form<SignUpPageProps> {
  protected template = `
    <main class="sign-up-page">
      <form class="register-form" novalidate>
        <h1 class="register-form__title">Регистрация</h1>
        <div class="register-form__fields">
          {{{ Field name="email"        label="Почта"      type="email" autocomplete="email" }}}
          {{{ Field name="login"        label="Логин"      autocomplete="username" }}}
          {{{ Field name="first_name"   label="Имя"        autocomplete="given-name" }}}
          {{{ Field name="second_name"  label="Фамилия"    autocomplete="family-name" }}}
          {{{ Field name="phone"        label="Телефон"    type="tel" autocomplete="tel" }}}
          {{{ Field name="password"     label="Пароль"     type="password" autocomplete="new-password" }}}
          {{{ Field name="password_confirm" label="Пароль (ещё раз)" type="password" autocomplete="new-password" }}}
        </div>
        {{#if error}}
          <p class="register-form__error">{{error}}</p>
        {{/if}}
        <div class="register-form__actions">
          {{{ Button label="Зарегистрироваться" type="submit" view="primary" size="full" }}}
          <a class="register-form__link" href="/">Уже зарегистрированы? Войти</a>
        </div>
      </form>
    </main>
  `;

  constructor() {
    super({});
  }

  protected override async onValidSubmit(
    values: Record<string, string>,
  ): Promise<void> {
    const password = values["password"] ?? "";
    const confirm = values["password_confirm"] ?? "";

    if (password !== confirm) {
      this.setProps({ error: "Пароли не совпадают" });
      return;
    }

    this.setProps({ error: undefined });
    await AuthController.register({
      email: values["email"] ?? "",
      login: values["login"] ?? "",
      first_name: values["first_name"] ?? "",
      second_name: values["second_name"] ?? "",
      phone: values["phone"] ?? "",
      password,
    });
  }

  protected override onSubmitError(err: unknown): void {
    const msg =
      err instanceof ApiError
        ? err.reason
        : "Ошибка регистрации. Проверьте данные.";
    this.setProps({ error: msg });
  }
}
