import { Component, inject } from '@angular/core';
import { APP_INFO } from '../app-info';

@Component({
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly info = inject(APP_INFO);
}
