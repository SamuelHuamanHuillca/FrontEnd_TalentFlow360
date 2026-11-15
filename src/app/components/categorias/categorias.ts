import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icono/icono';
@Component({
  selector: 'tf-category-links',
  imports: [RouterLink, Icon],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss',
})
export class CategoryLinks {
  readonly categories = [
    { title: 'Prácticas en tecnología', query: 'desarrollo', icon: 'code', color: 'pink' },
    { title: 'Análisis y negocios', query: 'datos', icon: 'chart', color: 'yellow' },
    { title: 'Diseño y creatividad', query: 'diseño', icon: 'spark', color: 'cyan' },
  ];
}
