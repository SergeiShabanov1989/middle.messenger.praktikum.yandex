import Form, { type FormProps } from "../../components/form/Form";
import AuthController from "../../controllers/AuthController";
import "./login.scss";

export default class LoginPage extends Form<FormProps> {
  protected template = `
    <main class="login-page">
      <form class="login-form" novalidate>
        <h1 class="login-form__title">Вход</h1>
        <div class="login-form__fields">
          {{{ Field name="login" label="Логин" autocomplete="username" }}}
          {{{ Field name="password" label="Пароль" type="password" autocomplete="current-password" }}}
        </div>
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
    await AuthController.login({
      login: values["login"] ?? "",
      password: values["password"] ?? "",
    });
  }
}
