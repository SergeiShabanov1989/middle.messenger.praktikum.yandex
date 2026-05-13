import Handlebars from 'handlebars';
import template from './message.hbs?raw';
import iconCheck from './icons/check.svg?raw';
import iconDoubleCheck from './icons/double-check.svg?raw';
import './message.scss';

Handlebars.registerPartial('message', template);
Handlebars.registerPartial('message-icon-check', iconCheck);
Handlebars.registerPartial('message-icon-double-check', iconDoubleCheck);

const render = Handlebars.compile(template);

export default render;
