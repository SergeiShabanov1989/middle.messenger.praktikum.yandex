import Block, { type BlockOwnProps } from "../../core/Block";
import ProfileField from "../../components/profile-field/ProfileField";
import UserController from "../../controllers/UserController";
import AuthController from "../../controllers/AuthController";
import UserModal from "../../components/user-modal/UserModal";
import { ApiError } from "../../core/HTTPTransport";
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
  error?: string;
}

const EMPTY_USER: User = {
  email: "",
  login: "",
  first_name: "",
  second_name: "",
  display_name: "",
  phone: "",
  avatarUrl: "",
};

type DataFieldName = Exclude<keyof User, "id">;

const DATA_FIELDS: Array<{
  name: DataFieldName;
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
          {{{ BackButton href="/messenger" }}}
        </aside>
        <div class="profile-page__content">
          <form class="profile-form" novalidate ref="form">
            {{{ ProfileAvatar avatarUrl=user.avatarUrl name=user.first_name editable=true }}}

            <div class="profile-form__fields" ref="fields"></div>

            {{#if error}}
              <p class="profile-form__error">{{error}}</p>
            {{/if}}

            {{#if isView}}
              <ul class="profile-form__actions">
                <li class="profile-form__action">
                  <a class="profile-form__link" href="/settings?mode=edit">Изменить данные</a>
                </li>
                <li class="profile-form__action">
                  <a class="profile-form__link" href="/settings?mode=password">Изменить пароль</a>
                </li>
                <li class="profile-form__action">
                  <a class="profile-form__link profile-form__link_danger" href="/" ref="logoutLink">Выйти</a>
                </li>
              </ul>
            {{else}}
              <div class="profile-form__submit">
                {{{ Button label="Сохранить" type="submit" view="primary" size="full" ref="submitBtn" }}}
                <button type="button" class="profile-form__cancel" ref="cancelBtn">Отменить</button>
              </div>
            {{/if}}
          </form>
        </div>
      </div>
    </main>
  `;

  private fieldComponents: ProfileField[] = [];
  private initialValues: Record<string, string> = {};
  private readonly userModal = new UserModal();

  constructor() {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const mode: ProfileMode =
      modeParam === "edit" || modeParam === "password" ? modeParam : "view";

    const user = UserController.get() ?? EMPTY_USER;

    super({
      mode,
      user,
      isView: mode === "view",
      isEdit: mode === "edit",
      isPassword: mode === "password",
    });

    this.buildFields(mode, user);
  }

  public override show(): void {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const mode: ProfileMode =
      modeParam === "edit" || modeParam === "password" ? modeParam : "view";

    const user = UserController.get() ?? EMPTY_USER;
    this.buildFields(mode, user);
    this.setProps({
      mode,
      user,
      error: undefined,
      isView: mode === "view",
      isEdit: mode === "edit",
      isPassword: mode === "password",
    });

    super.show();
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
      this.initialValues = Object.fromEntries(
        PASSWORD_FIELDS.map((f) => [f.name, ""]),
      );
    } else {
      this.fieldComponents = DATA_FIELDS.map(
        (config) =>
          new ProfileField({
            name: config.name,
            label: config.label,
            value: String(user[config.name] ?? ""),
            type: config.type,
            autocomplete: config.autocomplete,
            editable: mode === "edit",
          }),
      );
      this.initialValues = Object.fromEntries(
        DATA_FIELDS.map((f) => [f.name, String(user[f.name] ?? "")]),
      );
    }
  }

  private checkChanges(): void {
    const submitBtn = this.refs["submitBtn"];
    if (!(submitBtn instanceof HTMLButtonElement)) return;
    const hasChanges = this.fieldComponents.some(
      (field) => field.value() !== (this.initialValues[field.name()] ?? ""),
    );
    submitBtn.disabled = !hasChanges;
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
      fieldsContainer.addEventListener("input", () => this.checkChanges());
    }

    this.checkChanges();

    const form = this.refs["form"];
    if (form instanceof HTMLFormElement) {
      form.addEventListener("submit", (event) => {
        void this.handleSubmit(event);
      });
    }

    const avatarControl = this.element()?.querySelector<HTMLElement>(
      ".profile-avatar__control",
    );
    if (avatarControl) {
      avatarControl.addEventListener("click", (e) => {
        e.preventDefault();
        this.userModal.showFile("Сменить аватар", (file) => {
          const fd = new FormData();
          fd.append("avatar", file);
          void UserController.changeAvatar(fd)
            .then(() => {
              const updatedUser = UserController.get() ?? EMPTY_USER;
              this.setProps({ user: updatedUser });
              this.userModal.hide();
            })
            .catch((err: unknown) => {
              const msg =
                err instanceof ApiError
                  ? err.reason
                  : "Ошибка загрузки аватара";
              this.userModal.showError(msg);
            });
        });
      });
    }

    const logoutLink = this.refs["logoutLink"];
    if (logoutLink instanceof HTMLAnchorElement) {
      logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        void AuthController.logout();
      });
    }

    const cancelBtn = this.refs["cancelBtn"];
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.returnToView());
    }
  }

  private returnToView(): void {
    window.history.replaceState({}, "", "/settings");
    this.show();
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const values: Record<string, string> = {};
    let isValid = true;
    this.fieldComponents.forEach((field) => {
      const result = field.validate();
      field.showError(result.message);
      values[field.name()] = field.value();
      if (!result.valid) isValid = false;
    });

    if (!isValid) return;

    this.setProps({ error: undefined });

    try {
      if (this.props.mode === "password") {
        await UserController.changePassword({
          oldPassword: values["old_password"] ?? "",
          newPassword: values["new_password"] ?? "",
        });
      } else if (this.props.mode === "edit") {
        await UserController.update(values as Partial<User>);
      }
      this.returnToView();
    } catch (err) {
      const msg = err instanceof ApiError ? err.reason : "Ошибка сохранения";
      this.setProps({ error: msg });
    }
  }
}
