import Handlebars from 'handlebars';
import template from './main.hbs?raw';
import './main.scss';

Handlebars.registerPartial('layoutMain', template);

const render = Handlebars.compile(template);

export default render;
