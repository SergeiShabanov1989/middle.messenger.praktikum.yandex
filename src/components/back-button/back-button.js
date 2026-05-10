import Handlebars from 'handlebars';
import template from './back-button.hbs?raw';
import iconArrowLeft from './icons/arrow-left.svg?raw';
import './back-button.scss';

Handlebars.registerPartial('back-button', template);
Handlebars.registerPartial('back-button-icon-arrow-left', iconArrowLeft);

const render = Handlebars.compile(template);

export default render;
