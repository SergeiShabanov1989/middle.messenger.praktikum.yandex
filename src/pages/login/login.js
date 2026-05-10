import Handlebars from 'handlebars';
import layoutMain from '../../layout/main/index.js';
import '../../components/button/button.js';
import template from './login.hbs?raw';
import './login.scss';

const renderPage = Handlebars.compile(template);

document.body.innerHTML = layoutMain({ content: renderPage() });
