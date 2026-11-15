import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoticeStore } from './services/avisos.service';
import { inject } from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',

  styleUrl: './app.scss',
})
export class App {
  readonly notice = inject(NoticeStore);
}
