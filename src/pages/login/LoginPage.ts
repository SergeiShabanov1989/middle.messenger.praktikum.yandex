import Form, { type FormProps } from "../../components/form/Form";
import AuthController from "../../controllers/AuthController";
import { ApiError } from "../../core/HTTPTransport";
import "./login.scss";

interface LoginPageProps extends FormProps {
  error?: string;
}

export default class LoginPage extends Form<LoginPageProps> {
  protected template = `
    <main class="login-page">
      <form class="login-form" novalidate>
        <h1 class="login-form__title">Вход</h1>
        <div class="login-form__fields">
          {{{ Field name="login" label="Логин" autocomplete="username" }}}
          {{{ Field name="password" label="Пароль" type="password" autocomplete="current-password" }}}
        </div>
        {{#if error}}
          <p class="login-form__error">{{error}}</p>
        {{/if}}
        <div class="login-form__actions">
          {{{ Button label="Войти" type="submit" view="primary" size="full" }}}
          <a class="login-form__link" href="/sign-up">Ещё не зарегистрированы?</a>
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
    this.setProps({ error: undefined });
    await AuthController.login({
      login: values["login"] ?? "",
      password: values["password"] ?? "",
    });
  }

  protected override onSubmitError(err: unknown): void {
    const msg =
      err instanceof ApiError ? err.reason : "Ошибка входа. Проверьте данные.";
    this.setProps({ error: msg });
  }
}
