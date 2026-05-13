import Handlebars from 'handlebars';
import '../../../../components/button/button.js';
import template from './register.hbs?raw';
import './register.scss';

Handlebars.registerPartial('register', template);

const render = Handlebars.compile(template);

export default render;
