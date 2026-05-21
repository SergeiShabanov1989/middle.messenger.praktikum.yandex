import Block, { type BlockOwnProps } from "../../core/Block";
import iconPlaceholder from "./icons/image-placeholder.svg?raw";
import "./profile-avatar.scss";

export interface ProfileAvatarProps extends BlockOwnProps {
  avatarUrl?: string;
  name?: string;
  editable?: boolean;
  mix?: string;
}

export default class ProfileAvatar extends Block<ProfileAvatarProps> {
  static componentName = "ProfileAvatar";

  protected template = `
    <div class="profile-avatar{{#if editable}} profile-avatar_editable{{/if}}{{#if mix}} {{mix}}{{/if}}">
      {{#if editable}}
        <label class="profile-avatar__control">
          <span class="profile-avatar__image">
            {{#if avatarUrl}}
              <img class="profile-avatar__img" src="{{avatarUrl}}" alt="Аватар профиля" />
            {{else}}
              ${iconPlaceholder}
            {{/if}}
            <span class="profile-avatar__overlay">Поменять<br />аватар</span>
          </span>
          <input class="profile-avatar__input" type="file" name="avatar" accept="image/*" />
        </label>
      {{else}}
        <span class="profile-avatar__image">
          {{#if avatarUrl}}
            <img class="profile-avatar__img" src="{{avatarUrl}}" alt="Аватар профиля" />
          {{else}}
            ${iconPlaceholder}
          {{/if}}
        </span>
      {{/if}}
      {{#if name}}
        <p class="profile-avatar__name">{{name}}</p>
      {{/if}}
    </div>
  `;
}
