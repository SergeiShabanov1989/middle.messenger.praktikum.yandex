import Handlebars from 'handlebars';
import template from './error-message.hbs?raw';
import './error-message.scss';

Handlebars.registerPartial('error-message', template);

const render = Handlebars.compile(template);

export default render;
