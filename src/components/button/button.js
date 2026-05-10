import Handlebars from 'handlebars';
import template from './button.hbs?raw';
import './button.scss';

Handlebars.registerPartial('button', template);

const render = Handlebars.compile(template);

export default render;
