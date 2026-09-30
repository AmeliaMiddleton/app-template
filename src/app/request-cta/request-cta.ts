import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_INFO } from '../app-info';

export type Audience = 'teacher' | 'school' | 'district' | 'other';
export type RequestType = 'bid' | 'info';

/** If the visitor is typing when the popup is due, try again after this long. */
export const TYPING_RETRY_MS = 10_000;

const TYPING_SELECTOR = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

/**
 * "Customize this" button plus a dialog that invites visitors to request a bid
 * or more information on geekamu.com. The dialog opens on its own once per
 * visitor after `popupDelayMs`, and any time from the button.
 */
@Component({
  selector: 'app-request-cta',
  styleUrl: './request-cta.scss',
  templateUrl: './request-cta.html',
})
export class RequestCta {
  protected readonly info = inject(APP_INFO);
  protected readonly audiences: { value: Audience; label: string }[] = [
    { value: 'teacher', label: 'A teacher or classroom' },
    { value: 'school', label: 'A school' },
    { value: 'district', label: 'A school district' },
    { value: 'other', label: 'Something else' },
  ];
  protected readonly audience = signal<Audience | null>(null);
  protected readonly isOpen = signal(false);
  protected readonly bidUrl = computed(() => this.requestUrl('bid'));
  protected readonly infoUrl = computed(() => this.requestUrl('info'));

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly document = inject(DOCUMENT);
  private readonly seenKey = `request-cta-seen:${this.info.slug}`;
  private returnFocusTo: HTMLElement | null = null;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID)) && !this.alreadySeen()) {
      this.scheduleAutoOpen(this.info.popupDelayMs);
    }
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  open(): void {
    if (this.isOpen()) return;
    clearTimeout(this.timer);
    this.markSeen();
    const active = this.document.activeElement;
    this.returnFocusTo = active instanceof HTMLElement ? active : null;

    const dialog = this.dialog().nativeElement;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    this.isOpen.set(true);
  }

  close(): void {
    const dialog = this.dialog().nativeElement;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      this.onClosed();
    }
  }

  /** Runs for every close, including Esc. */
  protected onClosed(): void {
    this.isOpen.set(false);
    this.returnFocusTo?.focus();
    this.returnFocusTo = null;
  }

  private requestUrl(type: RequestType): string {
    const url = new URL(this.info.requestUrl);
    url.searchParams.set('app', this.info.slug);
    url.searchParams.set('type', type);
    const audience = this.audience();
    if (audience) url.searchParams.set('for', audience);
    return url.toString();
  }

  private scheduleAutoOpen(delayMs: number): void {
    this.timer = setTimeout(() => {
      if (this.isOpen()) return;
      if (this.document.activeElement?.matches(TYPING_SELECTOR)) {
        this.scheduleAutoOpen(TYPING_RETRY_MS);
        return;
      }
      this.open();
    }, delayMs);
  }

  // Storage can be missing or blocked (private windows); the popup then just shows once per page load.
  private alreadySeen(): boolean {
    try {
      return localStorage.getItem(this.seenKey) !== null;
    } catch {
      return false;
    }
  }

  private markSeen(): void {
    try {
      localStorage.setItem(this.seenKey, new Date().toISOString());
    } catch {
      // Ignore: see alreadySeen().
    }
  }
}
