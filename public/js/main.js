import { APP_INFO } from './app-info.js';
import { initRequestCta } from './request-cta.js';

document.querySelectorAll('[data-app-name]').forEach((el) => (el.textContent = APP_INFO.name));
document.querySelectorAll('[data-author-link]').forEach((el) => (el.href = APP_INFO.authorUrl));

initRequestCta(APP_INFO);
