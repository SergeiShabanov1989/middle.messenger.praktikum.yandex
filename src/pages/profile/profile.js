import Handlebars from 'handlebars';
import layoutMain from '../../layout/main/index.js';
import '../../components/button/button.js';
import '../../components/back-button/back-button.js';
import '../../components/profile-avatar/profile-avatar.js';
import profileFieldTemplate from '../../components/profile-field/profile-field.hbs?raw';
import '../../components/profile-field/profile-field.scss';
import template from './profile.hbs?raw';
import './profile.scss';
import { user } from '../../mocks/user.js';

Handlebars.registerPartial('profile-field', profileFieldTemplate);

const DATA_FIELDS = [
  { name: 'email',        label: 'Почта',     type: 'email', autocomplete: 'email' },
  { name: 'login',        label: 'Логин',     autocomplete: 'username' },
  { name: 'first_name',   label: 'Имя',       autocomplete: 'given-name' },
  { name: 'second_name',  label: 'Фамилия',   autocomplete: 'family-name' },
  { name: 'display_name', label: 'Имя в чате' },
  { name: 'phone',        label: 'Телефон',   type: 'tel', autocomplete: 'tel' },
];

const PASSWORD_FIELDS = [
  { name: 'old_password', label: 'Старый пароль', type: 'password', autocomplete: 'current-password' },
  { name: 'new_password', label: 'Новый пароль',  type: 'password', autocomplete: 'new-password' },
];

const mode = new URLSearchParams(window.location.search).get('mode');
const isPassword = mode === 'password';
const isEdit = mode === 'edit';
const isView = !isEdit && !isPassword;

const fields = (isPassword ? PASSWORD_FIELDS : DATA_FIELDS).map((field) => ({
  ...field,
  value: isPassword ? '' : user[field.name] ?? '',
  editable: !isView,
}));

const avatar = {
  avatarUrl: user.avatarUrl,
  name: isView ? user.first_name : '',
  editable: !isView,
};

const renderPage = Handlebars.compile(template);

document.body.innerHTML = layoutMain({
  content: renderPage({ fields, avatar, isView, isEdit, isPassword }),
});
