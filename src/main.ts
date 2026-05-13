
import './styles/global.scss';

type PageLoader = () => Promise<unknown>;

const routes: Record<string, PageLoader> = {
  '/': () => import('./pages/home/index.js'),
  '/login': () => import('./pages/login/index.js'),
  '/sign-up': () => import('./pages/sign-up/index.js'),
  '/profile': () => import('./pages/profile/index.js'),
  '/500': () => import('./pages/server-error/index.js'),
  '/404': () => import('./pages/not-found/index.js'),
};

const pathname = window.location.pathname;
const load = routes[pathname];

if (load) {
  load();
} else {
  history.replaceState(null, '', '/404');
  routes['/404']();
}
