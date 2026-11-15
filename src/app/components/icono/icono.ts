import { Component, input } from '@angular/core';
@Component({
  selector: 'tf-icon',
  templateUrl: './icono.html',
  styleUrl: './icono.scss',
})
export class Icon {
  readonly name = input('grid');
  readonly paths: Record<string, string> = {
    pause: 'M8 4v16 M16 4v16',
    play: 'M7 3l14 9-14 9z',
    external: 'M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7',
    code: 'M8 5 2 12l6 7 M16 5l6 7-6 7 M14 3l-4 18',
    chevron: 'm6 9 6 6 6-6',
    lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
    eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    'eye-off':
      'M3 3l18 18 M10 5a11 11 0 0 1 12 7s-1 3-4 5 M6 6c-3 2-4 6-4 6s3 7 10 7c2 0 4-1 5-2 M10 10a3 3 0 0 0 4 4',
    resume: 'M5 2h10l4 4v16H5z M15 2v5h4 M8 11h8 M8 15h8 M8 19h5',
    graduation: 'M2 8l10-5 10 5-10 5z M6 10v7c4 3 8 3 12 0v-7 M22 8v8',
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    arrow: 'M4 12h16 M14 6l6 6-6 6',
    search: 'M21 21l-6-6 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
    briefcase: 'M3 7h18v14H3z M8 7V3h8v4 M3 12c6 4 12 4 18 0 M12 12v4',
    user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M3 21a9 9 0 0 1 18 0',
    calendar: 'M3 5h18v16H3z M7 3v4 M17 3v4 M3 10h18 M7 14h3 M14 14h3',
    check: 'M5 12l4 4L19 6',
    layers: 'M3 7l9-5 9 5-9 5z M3 12l9 5 9-5 M3 17l9 5 9-5',
    logout: 'M9 3H3v18h6 M9 12h12 M16 7l5 5-5 5',
    chart: 'M4 3v18h18 M9 17v-5 M14 17V8 M19 17V4',
    shield: 'M12 2l9 4v6c0 5-9 10-9 10S3 17 3 12V6z M8 12l3 3 5-6',
    plus: 'M12 4v16 M4 12h16',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 7v5l3 2',
    pin: 'M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0 M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
    spark: 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    close: 'M5 5l14 14 M19 5L5 19',
  };
}
