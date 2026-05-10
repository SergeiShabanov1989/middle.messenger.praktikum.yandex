import Handlebars from 'handlebars';
import template from './profile-avatar.hbs?raw';
import iconImagePlaceholder from './icons/image-placeholder.svg?raw';
import './profile-avatar.scss';

Handlebars.registerPartial('profile-avatar', template);
Handlebars.registerPartial('profile-avatar-icon-placeholder', iconImagePlaceholder);

const render = Handlebars.compile(template);

export default render;
