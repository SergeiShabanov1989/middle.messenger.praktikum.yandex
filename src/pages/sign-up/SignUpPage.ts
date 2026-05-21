import Form, { type FormProps } from "../../components/form/Form";
import AuthController from "../../controllers/AuthController";
import "./sign-up.scss";
import "./modules/register/register.scss";

export default class SignUpPage extends Form<FormProps> {
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
        <div class="register-form__actions">
          {{{ Button label="Зарегистрироваться" type="submit" view="primary" size="full" }}}
          <a class="register-form__link" href="/login">Уже зарегистрированы? Войти</a>
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
    await AuthController.register({
      email: values["email"] ?? "",
      login: values["login"] ?? "",
      first_name: values["first_name"] ?? "",
      second_name: values["second_name"] ?? "",
      phone: values["phone"] ?? "",
      password: values["password"] ?? "",
      password_confirm: values["password_confirm"] ?? "",
    });
  }
}
