import Handlebars from 'handlebars';
import layoutMain from '../../layout/main/index.js';
import './modules/register/index.js';
import template from './sign-up.hbs?raw';
import './sign-up.scss';

const renderPage = Handlebars.compile(template);

document.body.innerHTML = layoutMain({ content: renderPage() });
