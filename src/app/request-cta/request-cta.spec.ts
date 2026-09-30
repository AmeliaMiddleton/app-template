import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { APP_INFO, APP_INFO_DEFAULTS } from '../app-info';
import { RequestCta, TYPING_RETRY_MS } from './request-cta';

const DELAY = 1_000;
const SEEN_KEY = 'request-cta-seen:test-app';

describe('RequestCta', () => {
  let fixture: ComponentFixture<RequestCta>;

  const dialog = () => fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
  const link = (text: string) =>
    [...fixture.nativeElement.querySelectorAll('a')].find((a: HTMLAnchorElement) =>
      a.textContent?.includes(text),
    ) as HTMLAnchorElement;

  function create() {
    fixture = TestBed.createComponent(RequestCta);
    fixture.detectChanges();
  }

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    TestBed.configureTestingModule({
      imports: [RequestCta],
      providers: [
        {
          provide: APP_INFO,
          useValue: {
            ...APP_INFO_DEFAULTS,
            slug: 'test-app',
            name: 'Test App',
            popupDelayMs: DELAY,
          },
        },
      ],
    });
  });

  afterEach(() => {
    fixture?.destroy();
    vi.useRealTimers();
  });

  it('links to the request form with the app and request type', () => {
    create();
    const bid = new URL(link('Request a bid').href);
    const info = new URL(link('Request more information').href);

    expect(bid.origin + bid.pathname).toBe('https://geekamu.com/request');
    expect(bid.searchParams.get('app')).toBe('test-app');
    expect(bid.searchParams.get('type')).toBe('bid');
    expect(bid.searchParams.has('for')).toBe(false);
    expect(info.searchParams.get('type')).toBe('info');
  });

  it('adds who it is for once an audience is chosen', () => {
    create();
    const district = fixture.nativeElement.querySelector(
      'input[value="district"]',
    ) as HTMLInputElement;
    district.click();
    fixture.detectChanges();

    expect(new URL(link('Request a bid').href).searchParams.get('for')).toBe('district');
  });

  it('opens from the button and closes with "Not now"', () => {
    create();
    (fixture.nativeElement.querySelector('.open-button') as HTMLButtonElement).click();
    expect(dialog().hasAttribute('open')).toBe(true);

    (fixture.nativeElement.querySelector('.close-button') as HTMLButtonElement).click();
    expect(dialog().hasAttribute('open')).toBe(false);
  });

  it('opens on its own after the delay, only once per visitor', () => {
    create();
    vi.advanceTimersByTime(DELAY - 1);
    expect(dialog().hasAttribute('open')).toBe(false);

    vi.advanceTimersByTime(1);
    expect(dialog().hasAttribute('open')).toBe(true);
    expect(localStorage.getItem(SEEN_KEY)).not.toBeNull();
  });

  it('does not open on its own for a returning visitor', () => {
    localStorage.setItem(SEEN_KEY, 'earlier');
    create();
    vi.advanceTimersByTime(DELAY * 10);
    expect(dialog().hasAttribute('open')).toBe(false);
  });

  it('waits while the visitor is typing', () => {
    create();
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    vi.advanceTimersByTime(DELAY);
    expect(dialog().hasAttribute('open')).toBe(false);

    input.blur();
    vi.advanceTimersByTime(TYPING_RETRY_MS);
    expect(dialog().hasAttribute('open')).toBe(true);
    input.remove();
  });
});
