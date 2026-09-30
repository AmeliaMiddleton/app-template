import { InjectionToken } from '@angular/core';

/** Settings each app changes once after "Use this template". */
export interface AppInfo {
  /** Short id sent to the request form, e.g. `reading-helper`. */
  slug: string;
  /** Name shown in the header and the request popup. */
  name: string;
  /** geekamu.com page that collects bid and information requests. */
  requestUrl: string;
  /** Where "A demo by Amelia Cox" links to. */
  authorUrl: string;
  /** How long a visitor uses the demo before the request popup opens on its own. */
  popupDelayMs: number;
}

export const APP_INFO_DEFAULTS: AppInfo = {
  slug: 'app-template',
  name: 'App Template',
  requestUrl: 'https://geekamu.com/request',
  authorUrl: 'https://ameliacox-me.pages.dev',
  popupDelayMs: 60_000,
};

export const APP_INFO = new InjectionToken<AppInfo>('APP_INFO', {
  factory: () => APP_INFO_DEFAULTS,
});
