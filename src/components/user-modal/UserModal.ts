import "./user-modal.scss";

export interface ModalOptions {
  label?: string;
  placeholder?: string;
  confirmText?: string;
  emptyError?: string;
}

export default class UserModal {
  private readonly overlay: HTMLElement;
  private readonly titleEl: HTMLElement;
  private readonly labelEl: HTMLElement;
  private readonly inputEl: HTMLInputElement;
  private readonly errorEl: HTMLElement;
  private readonly confirmBtn: HTMLButtonElement;
  private onConfirmCb: ((value: string) => void) | null = null;
  private emptyError = "Заполните поле";

  private readonly textFieldEl: HTMLElement;
  private readonly fileFieldEl: HTMLElement;
  private readonly fileInputEl: HTMLInputElement;
  private readonly fileNameEl: HTMLElement;
  private readonly filePreviewEl: HTMLElement;
  private fileConfirmCb: ((file: File) => void) | null = null;
  private currentPreviewUrl: string | null = null;
  private mode: "text" | "file" = "text";

  constructor() {
    this.overlay = document.createElement("div");
    this.overlay.className = "user-modal-overlay";
    this.overlay.style.display = "none";

    const dialog = document.createElement("div");
    dialog.className = "user-modal";

    this.titleEl = document.createElement("h3");
    this.titleEl.className = "user-modal__title";

    this.textFieldEl = document.createElement("div");
    this.textFieldEl.className = "user-modal__field";

    this.labelEl = document.createElement("label");
    this.labelEl.className = "user-modal__label";

    this.inputEl = document.createElement("input");
    this.inputEl.className = "user-modal__input";
    this.inputEl.type = "text";
    this.inputEl.autocomplete = "off";

    this.textFieldEl.append(this.labelEl, this.inputEl);

    this.fileFieldEl = document.createElement("div");
    this.fileFieldEl.className = "user-modal__field";
    this.fileFieldEl.style.display = "none";

    this.fileInputEl = document.createElement("input");
    this.fileInputEl.type = "file";
    this.fileInputEl.accept = "image/*";
    this.fileInputEl.className = "user-modal__file-input";

    const filePickLabel = document.createElement("label");
    filePickLabel.className = "user-modal__file-pick";
    filePickLabel.textContent = "Выбрать изображение";
    filePickLabel.appendChild(this.fileInputEl);

    this.fileNameEl = document.createElement("span");
    this.fileNameEl.className = "user-modal__file-name";

    this.filePreviewEl = document.createElement("div");
    this.filePreviewEl.className = "user-modal__file-preview";

    this.fileFieldEl.append(filePickLabel, this.fileNameEl, this.filePreviewEl);

    this.errorEl = document.createElement("p");
    this.errorEl.className = "user-modal__error";

    const actions = document.createElement("div");
    actions.className = "user-modal__actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "user-modal__btn user-modal__btn--cancel";
    cancelBtn.textContent = "Отмена";

    this.confirmBtn = document.createElement("button");
    this.confirmBtn.type = "button";
    this.confirmBtn.className = "user-modal__btn user-modal__btn--confirm";
    this.confirmBtn.textContent = "Подтвердить";

    actions.append(cancelBtn, this.confirmBtn);
    dialog.append(
      this.titleEl,
      this.textFieldEl,
      this.fileFieldEl,
      this.errorEl,
      actions,
    );
    this.overlay.appendChild(dialog);
    document.body.appendChild(this.overlay);

    cancelBtn.addEventListener("click", () => this.hide());
    this.confirmBtn.addEventListener("click", () => this.handleConfirm());
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleConfirm();
      if (e.key === "Escape") this.hide();
    });
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.hide();
    });
    this.fileInputEl.addEventListener("change", () => this.onFileChange());
  }

  private onFileChange(): void {
    const file = this.fileInputEl.files?.[0];
    if (!file) return;

    this.fileNameEl.textContent = file.name;
    if (this.currentPreviewUrl) {
      URL.revokeObjectURL(this.currentPreviewUrl);
    }
    this.currentPreviewUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = this.currentPreviewUrl;
    img.className = "user-modal__preview-img";
    img.alt = "Превью";
    this.filePreviewEl.replaceChildren(img);
    this.errorEl.textContent = "";
  }

  private handleConfirm(): void {
    if (this.mode === "file") {
      const file = this.fileInputEl.files?.[0];
      if (!file) {
        this.showError("Выберите файл");
        return;
      }
      this.errorEl.textContent = "";
      this.setLoading(true);
      this.fileConfirmCb?.(file);
    } else {
      const value = this.inputEl.value.trim();
      if (!value) {
        this.showError(this.emptyError);
        return;
      }
      this.errorEl.textContent = "";
      this.setLoading(true);
      this.onConfirmCb?.(value);
    }
  }

  private setLoading(loading: boolean): void {
    this.confirmBtn.disabled = loading;
    if (this.mode === "file") {
      this.fileInputEl.disabled = loading;
    } else {
      this.inputEl.disabled = loading;
    }
    this.confirmBtn.textContent = loading
      ? "Загрузка..."
      : (this.confirmBtn.dataset["confirmText"] ?? "Подтвердить");
  }

  public show(
    title: string,
    onConfirm: (value: string) => void,
    options: ModalOptions = {},
  ): void {
    this.mode = "text";
    this.textFieldEl.style.display = "";
    this.fileFieldEl.style.display = "none";

    this.titleEl.textContent = title;
    this.onConfirmCb = onConfirm;
    this.labelEl.textContent = options.label ?? "Логин пользователя";
    this.inputEl.placeholder = options.placeholder ?? "Введите логин";
    this.emptyError = options.emptyError ?? "Заполните поле";
    const confirmText = options.confirmText ?? "Подтвердить";
    this.confirmBtn.dataset["confirmText"] = confirmText;
    this.confirmBtn.textContent = confirmText;
    this.errorEl.textContent = "";
    this.inputEl.value = "";
    this.inputEl.classList.remove("user-modal__input--error");
    this.confirmBtn.disabled = false;
    this.inputEl.disabled = false;
    this.overlay.style.display = "flex";
    setTimeout(() => this.inputEl.focus(), 50);
  }

  public showFile(title: string, onConfirm: (file: File) => void): void {
    this.mode = "file";
    this.textFieldEl.style.display = "none";
    this.fileFieldEl.style.display = "";

    this.titleEl.textContent = title;
    this.fileConfirmCb = onConfirm;
    this.fileInputEl.value = "";
    this.fileInputEl.disabled = false;
    this.fileNameEl.textContent = "Файл не выбран";
    this.filePreviewEl.replaceChildren();
    if (this.currentPreviewUrl) {
      URL.revokeObjectURL(this.currentPreviewUrl);
      this.currentPreviewUrl = null;
    }
    this.errorEl.textContent = "";
    this.confirmBtn.dataset["confirmText"] = "Сохранить";
    this.confirmBtn.textContent = "Сохранить";
    this.confirmBtn.disabled = false;
    this.overlay.style.display = "flex";
  }

  public hide(): void {
    this.overlay.style.display = "none";
    this.onConfirmCb = null;
    this.fileConfirmCb = null;
    if (this.currentPreviewUrl) {
      URL.revokeObjectURL(this.currentPreviewUrl);
      this.currentPreviewUrl = null;
    }
  }

  public showError(message: string): void {
    this.errorEl.textContent = message;
    if (this.mode === "text") {
      this.inputEl.classList.add("user-modal__input--error");
    }
    this.confirmBtn.disabled = false;
    if (this.mode === "file") {
      this.fileInputEl.disabled = false;
    } else {
      this.inputEl.disabled = false;
    }
    this.confirmBtn.textContent =
      this.confirmBtn.dataset["confirmText"] ?? "Подтвердить";
  }

  public destroy(): void {
    if (this.currentPreviewUrl) {
      URL.revokeObjectURL(this.currentPreviewUrl);
    }
    this.overlay.remove();
  }
}
