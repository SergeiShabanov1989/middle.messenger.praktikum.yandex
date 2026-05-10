import Handlebars from 'handlebars';
import layoutMain from '../../layout/main/index.js';
import '../../components/error-message/error-message.js';
import template from './not-found.hbs?raw';
import '../error/error-page.scss';

const renderPage = Handlebars.compile(template);

document.body.innerHTML = layoutMain({ content: renderPage() });
