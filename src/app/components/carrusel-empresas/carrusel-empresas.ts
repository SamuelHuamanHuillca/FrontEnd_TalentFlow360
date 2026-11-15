import {
  afterNextRender,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANIES } from '../../data/empresas.data';
import { CompanyLogo } from '../logo-empresa/logo-empresa';
import { Icon } from '../icono/icono';
@Component({
  selector: 'tf-company-carousel',
  imports: [RouterLink, CompanyLogo, Icon],
  templateUrl: './carrusel-empresas.html',
  styleUrl: './carrusel-empresas.scss',
})
export class CompanyCarousel implements OnDestroy {
  @ViewChild('viewport') viewport?: ElementRef<HTMLElement>;
  readonly companies = COMPANIES;
  readonly slides = [...COMPANIES, ...COMPANIES, ...COMPANIES];
  readonly index = signal(COMPANIES.length);
  readonly slots = signal(6);
  readonly animated = signal(true);
  readonly playing = signal(false);
  readonly hovered = signal(false);
  readonly focused = signal(false);
  private observer?: ResizeObserver;
  private timer?: ReturnType<typeof setInterval>;
  private frame1?: number;
  private frame2?: number;
  private motion?: MediaQueryList;
  private moving = false;
  private readonly motionChanged = (event: MediaQueryListEvent) => this.playing.set(!event.matches);
  constructor() {
    afterNextRender(() => this.initialize());
  }
  private initialize() {
    this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.playing.set(!this.motion.matches);
    this.motion.addEventListener('change', this.motionChanged);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(this.viewport!.nativeElement);
    this.resize();
    this.timer = setInterval(() => {
      if (this.playing() && !this.hovered() && !this.focused() && !document.hidden) this.move(1);
    }, 4000);
  }
  private resize() {
    this.moving = false;
    const w = this.viewport?.nativeElement.clientWidth ?? 1000;
    const slots = w >= 1000 ? 6 : w >= 760 ? 4 : w >= 560 ? 3 : w >= 320 ? 2 : 1;
    if (slots !== this.slots()) {
      this.animated.set(false);
      this.slots.set(slots);
      this.restoreAnimation();
    }
  }
  move(delta: number) {
    if (!this.animated() || this.moving) return;
    this.moving = true;
    this.index.update((i) => i + delta);
    if (this.motion?.matches) {
      this.moving = false;
      this.wrap();
    }
  }
  finish(event: TransitionEvent) {
    if (event.propertyName === 'transform') {
      this.moving = false;
      this.wrap();
    }
  }
  private wrap() {
    const n = COMPANIES.length;
    if (this.index() >= 2 * n || this.index() < n) {
      this.animated.set(false);
      this.index.set(this.index() >= 2 * n ? this.index() - n : this.index() + n);
      this.restoreAnimation();
    }
  }
  private restoreAnimation() {
    if (this.frame1) cancelAnimationFrame(this.frame1);
    if (this.frame2) cancelAnimationFrame(this.frame2);
    this.frame1 = requestAnimationFrame(() => {
      this.frame2 = requestAnimationFrame(() => this.animated.set(true));
    });
  }
  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.timer) clearInterval(this.timer);
    if (this.frame1) cancelAnimationFrame(this.frame1);
    if (this.frame2) cancelAnimationFrame(this.frame2);
    this.motion?.removeEventListener('change', this.motionChanged);
  }
}
