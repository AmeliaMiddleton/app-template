import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the skip link, main landmark, and request button', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.skip-link')?.getAttribute('href')).toBe('#main');
    expect(compiled.querySelector('main#main')).toBeTruthy();
    expect(compiled.querySelector('app-request-cta button')?.textContent).toContain(
      'Customize this',
    );
  });
});
