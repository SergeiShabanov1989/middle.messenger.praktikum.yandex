import Block, { type BlockOwnProps } from "../../core/Block";
import ProfileField from "../../components/profile-field/ProfileField";
import UserController from "../../controllers/UserController";
import AuthController from "../../controllers/AuthController";
import { router } from "../../core/routerInstance";
import type { User } from "../../mocks/types";
import "../../components/back-button/back-button.scss";
import "../../components/profile-avatar/profile-avatar.scss";
import "../../components/profile-field/profile-field.scss";
import "./profile.scss";

type ProfileMode = "view" | "edit" | "password";

interface ProfilePageProps extends BlockOwnProps {
  mode: ProfileMode;
  user: User;
  isView: boolean;
  isEdit: boolean;
  isPassword: boolean;
}

const DATA_FIELDS: Array<{
  name: keyof User;
  label: string;
  type?: string;
  autocomplete?: string;
}> = [
  { name: "email", label: "Почта", type: "email", autocomplete: "email" },
  { name: "login", label: "Логин", autocomplete: "username" },
  { name: "first_name", label: "Имя", autocomplete: "given-name" },
  { name: "second_name", label: "Фамилия", autocomplete: "family-name" },
  { name: "display_name", label: "Имя в чате" },
  { name: "phone", label: "Телефон", type: "tel", autocomplete: "tel" },
];

const PASSWORD_FIELDS = [
  {
    name: "old_password",
    label: "Старый пароль",
    type: "password",
    autocomplete: "current-password",
  },
  {
    name: "new_password",
    label: "Новый пароль",
    type: "password",
    autocomplete: "new-password",
  },
];

export default class ProfilePage extends Block<ProfilePageProps> {
  protected template = `
    <main class="profile-page">
      <div class="profile-page__layout">
        <aside class="profile-page__aside">
          {{{ BackButton href="/" }}}
        </aside>
        <div class="profile-page__content">
          <form class="profile-form" novalidate ref="form">
            {{{ ProfileAvatar avatarUrl=user.avatarUrl name=user.first_name editable=isEdit }}}

            <div class="profile-form__fields" ref="fields"></div>

            {{#if isView}}
              <ul class="profile-form__actions">
                <li class="profile-form__action">
                  <a class="profile-form__link" href="/profile?mode=edit">Изменить данные</a>
                </li>
                <li class="profile-form__action">
                  <a class="profile-form__link" href="/profile?mode=password">Изменить пароль</a>
                </li>
                <li class="profile-form__action">
                  <a class="profile-form__link profile-form__link_danger" href="/login" ref="logoutLink">Выйти</a>
                </li>
              </ul>
            {{else}}
              <div class="profile-form__submit">
                {{{ Button label="Сохранить" type="submit" view="primary" size="full" }}}
              </div>
            {{/if}}
          </form>
        </div>
      </div>
    </main>
  `;

  private fieldComponents: ProfileField[] = [];

  constructor() {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const mode: ProfileMode =
      modeParam === "edit" || modeParam === "password" ? modeParam : "view";

    const user = UserController.get();

    super({
      mode,
      user,
      isView: mode === "view",
      isEdit: mode === "edit",
      isPassword: mode === "password",
    });

    this.buildFields(mode, user);
  }

  private buildFields(mode: ProfileMode, user: User): void {
    if (mode === "password") {
      this.fieldComponents = PASSWORD_FIELDS.map(
        (config) =>
          new ProfileField({
            name: config.name,
            label: config.label,
            type: config.type,
            autocomplete: config.autocomplete,
            editable: true,
            value: "",
          }),
      );
    } else {
      this.fieldComponents = DATA_FIELDS.map(
        (config) =>
          new ProfileField({
            name: config.name,
            label: config.label,
            value: user[config.name] ?? "",
            type: config.type,
            autocomplete: config.autocomplete,
            editable: mode === "edit",
          }),
      );
    }
  }

  protected override componentDidMount(): void {
    const fieldsContainer = this.refs["fields"];
    if (fieldsContainer) {
      fieldsContainer.replaceChildren();
      this.fieldComponents.forEach((field) => {
        const node = field.element();
        if (node) fieldsContainer.appendChild(node);
      });
      this.children.push(...this.fieldComponents);
    }

    const form = this.refs["form"];
    if (form instanceof HTMLFormElement) {
      form.addEventListener("submit", (event) => this.handleSubmit(event));
    }

    const logoutLink = this.refs["logoutLink"];
    if (logoutLink instanceof HTMLAnchorElement) {
      logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        void AuthController.logout();
      });
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const values: Record<string, string> = {};
    let isValid = true;
    this.fieldComponents.forEach((field) => {
      const result = field.validate();
      field.showError(result.message);
      values[field.name()] = field.value();
      if (!result.valid) isValid = false;
    });

    console.log(values);
    if (!isValid) return;

    if (this.props.mode === "password") {
      UserController.changePassword({
        oldPassword: values["old_password"] ?? "",
        newPassword: values["new_password"] ?? "",
      });
    } else if (this.props.mode === "edit") {
      UserController.update(values as Partial<User>);
    }
    router.go("/profile");
  }
}
