import { ApiError } from '../../core/HTTPTransport';
import type { ChatMember } from '../../mocks/types';
import './members-modal.scss';

export default class MembersModal {
  private readonly overlay: HTMLElement;
  private readonly listEl: HTMLElement;
  private readonly errorEl: HTMLElement;
  private onRemoveCb: ((member: ChatMember) => Promise<void>) | null = null;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'members-modal-overlay';
    this.overlay.style.display = 'none';

    const dialog = document.createElement('div');
    dialog.className = 'members-modal';

    const titleEl = document.createElement('h3');
    titleEl.className = 'members-modal__title';
    titleEl.textContent = 'Участники чата';

    this.listEl = document.createElement('ul');
    this.listEl.className = 'members-modal__list';

    this.errorEl = document.createElement('p');
    this.errorEl.className = 'members-modal__error';

    const footer = document.createElement('div');
    footer.className = 'members-modal__footer';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'members-modal__close-btn';
    closeBtn.textContent = 'Закрыть';
    closeBtn.addEventListener('click', () => this.hide());
    footer.appendChild(closeBtn);

    dialog.append(titleEl, this.listEl, this.errorEl, footer);
    this.overlay.appendChild(dialog);
    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.hide();
    });
  }

  public show(members: ChatMember[], onRemove: (member: ChatMember) => Promise<void>): void {
    this.onRemoveCb = onRemove;
    this.errorEl.textContent = '';
    this.renderList(members);
    this.overlay.style.display = 'flex';
  }

  public hide(): void {
    this.overlay.style.display = 'none';
    this.onRemoveCb = null;
  }

  private renderList(members: ChatMember[]): void {
    this.listEl.replaceChildren();
    if (members.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'members-modal__empty';
      empty.textContent = 'Нет участников';
      this.listEl.appendChild(empty);
      return;
    }
    members.forEach((member) => {
      this.listEl.appendChild(this.createRow(member));
    });
  }

  private createRow(member: ChatMember): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'members-modal__item';

    const avatar = document.createElement('div');
    avatar.className = 'members-modal__avatar';
    if (member.avatarUrl) {
      const img = document.createElement('img');
      img.src = member.avatarUrl;
      img.alt = member.name;
      img.className = 'members-modal__avatar-img';
      avatar.appendChild(img);
    } else {
      avatar.textContent = member.initials;
    }

    const name = document.createElement('span');
    name.className = 'members-modal__name';
    name.textContent = member.name;

    li.append(avatar, name);

    if (member.isOwner) {
      const badge = document.createElement('span');
      badge.className = 'members-modal__owner-badge';
      badge.textContent = 'создатель';
      li.appendChild(badge);
    } else {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'members-modal__remove-btn';
      btn.title = 'Удалить из чата';
      btn.setAttribute('aria-label', `Удалить ${member.name}`);
      btn.textContent = '✕';
      btn.addEventListener('click', () => this.handleRemove(member, li, btn));
      li.appendChild(btn);
    }

    return li;
  }

  private handleRemove(member: ChatMember, row: HTMLLIElement, btn: HTMLButtonElement): void {
    if (!this.onRemoveCb) return;
    btn.disabled = true;
    btn.textContent = '…';
    this.errorEl.textContent = '';

    void this.onRemoveCb(member)
      .then(() => {
        row.remove();
        if (this.listEl.querySelectorAll('.members-modal__item').length === 0) {
          this.renderList([]);
        }
      })
      .catch((err: unknown) => {
        btn.disabled = false;
        btn.textContent = '✕';
        this.errorEl.textContent =
          err instanceof ApiError ? err.reason : 'Ошибка удаления';
      });
  }

  public destroy(): void {
    this.overlay.remove();
  }
}
