import Handlebars from 'handlebars';
import template from './chat-window.hbs?raw';
import iconPaperclip from './icons/paperclip.svg?raw';
import iconArrowRight from './icons/arrow-right.svg?raw';
import './chat-window.scss';

Handlebars.registerPartial('chat-window', template);
Handlebars.registerPartial('chat-window-icon-paperclip', iconPaperclip);
Handlebars.registerPartial('chat-window-icon-arrow-right', iconArrowRight);

const render = Handlebars.compile(template);

export default render;
