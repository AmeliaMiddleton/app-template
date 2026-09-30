import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_INFO } from './app-info';
import { RequestCta } from './request-cta/request-cta';

@Component({
  imports: [RouterOutlet, RequestCta],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly info = inject(APP_INFO);
}
