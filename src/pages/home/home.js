import Handlebars from 'handlebars';
import layoutMain from '../../layout/main/index.js';
import template from './home.hbs?raw';
import chatItemTemplate from '../../components/chat-item/chat-item.hbs?raw';
import chatListTemplate from '../../components/chat-list/chat-list.hbs?raw';
import chatSearchTemplate from '../../components/chat-search/chat-search.hbs?raw';
import chatSidebarTemplate from '../../components/chat-sidebar/chat-sidebar.hbs?raw';
import '../../components/chat-window/chat-window.js';
import '../../components/message/message.js';
import { chats, activeChatId as initialActiveChatId } from '../../mocks/chats.js';
import eqHelper from '../../helpers/eq.js';
import './home.scss';
import '../../components/chat-item/chat-item.scss';
import '../../components/chat-list/chat-list.scss';
import '../../components/chat-search/chat-search.scss';
import '../../components/chat-sidebar/chat-sidebar.scss';

Handlebars.registerHelper('eq', eqHelper);

Handlebars.registerPartial('chat-item', chatItemTemplate);
Handlebars.registerPartial('chat-list', chatListTemplate);
Handlebars.registerPartial('chat-search', chatSearchTemplate);
Handlebars.registerPartial('chat-sidebar', chatSidebarTemplate);

const renderPage = Handlebars.compile(template);

let activeChatId = initialActiveChatId ?? null;

function render() {
  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;
  const content = renderPage({ chats, activeChatId, activeChat });
  document.body.innerHTML = layoutMain({ content });
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('.chat-item').forEach((el) => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.id);
      if (id && id !== activeChatId) {
        activeChatId = id;
        render();
      }
    });
  });

  const backButton = document.querySelector('.chat-window__back');
  if (backButton) {
    backButton.addEventListener('click', () => {
      activeChatId = null;
      render();
    });
  }
}

render();
