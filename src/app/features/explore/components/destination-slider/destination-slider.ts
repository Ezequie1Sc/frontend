import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  OnDestroy
} from '@angular/core';

import {
  destinations as allDestinations,
  Destination
} from '../../../../data/destinations.data';

import {
  DestinationSelectionService
} from '../../../../core/services/destination-selection.service';

import {
  CloudinaryService
} from '../../../../core/services/cloudinary.service';

import {
  I18nService
} from '../../../../core/services/i18n.service';

import {
  PostcardService
} from '../../../../core/services/postcard.service';

// ========================================
// DESTINOS EXCLUSIVOS DEL CARRUSEL
// ========================================

const sliderDestinationIds = [
  'campeche',
  'edzna',
  'calakmul',
  'isla'
];

const destinations: Destination[] = sliderDestinationIds
  .map(id => allDestinations.find(destination => destination.id === id))
  .filter((destination): destination is Destination => !!destination);

// ========================================
// COMPONENTE
// ========================================

@Component({
  selector: 'app-destination-slider',
  standalone: true,
  templateUrl: './destination-slider.html',
  styleUrl: './destination-slider.css'
})
export class DestinationSlider implements OnDestroy {

  // ========================================
  // SERVICIOS
  // ========================================

  private readonly selection = inject(DestinationSelectionService);
  private readonly media = inject(CloudinaryService);
  private readonly i18n = inject(I18nService);
  private readonly postcard = inject(PostcardService);

  // ========================================
  // ESTADO DEL CARRUSEL
  // ========================================

  readonly currentIndex = signal(0);
  readonly transitioning = signal(false);

  readonly lang = this.i18n.lang;

  readonly totalDestinations = destinations.length;

  private touchStartX = 0;
  private touchStartY = 0;

  private transitionTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly transitionDuration = 700;

  // ========================================
  // DESTINOS DEL CARRUSEL
  // ========================================

  readonly items = computed(() => {

    const index = this.currentIndex();

    return [
      ...destinations.slice(index),
      ...destinations.slice(0, index)
    ];

  });

  // Destino principal.

  readonly active = computed(() => {

    return destinations[this.currentIndex()];

  });

  // Tarjetas flotantes del lado derecho.

  readonly floating = computed(() => {

    return this.items().slice(1, 3);

  });

  // ========================================
  // CLOUDINARY
  // ========================================

  get cloud(): CloudinaryService {
    return this.media;
  }

  // ========================================
  // INTERNACIONALIZACIÓN
  // ========================================

  t(es: string, en: string): string {

    return this.lang() === 'es' ? es : en;

  }

  // ========================================
  // SIGUIENTE DESTINO
  // ========================================

  next(): void {

    if (this.totalDestinations <= 1) {
      return;
    }

    const targetIndex =
      (this.currentIndex() + 1) %
      this.totalDestinations;

    this.changeDestination(targetIndex);

  }

  // ========================================
  // DESTINO ANTERIOR
  // ========================================

  prev(): void {

    if (this.totalDestinations <= 1) {
      return;
    }

    const targetIndex = (
      this.currentIndex() -
      1 +
      this.totalDestinations
    ) % this.totalDestinations;

    this.changeDestination(targetIndex);

  }

  // ========================================
  // SELECCIÓN DE TARJETAS FLOTANTES
  // ========================================

  selectFloating(destination: Destination): void {

    const targetIndex = destinations.findIndex(
      item => item.id === destination.id
    );

    this.changeDestination(targetIndex);

  }

  // ========================================
  // TRANSICIÓN ENTRE DESTINOS
  // ========================================

  private changeDestination(targetIndex: number): void {

    // Validar el índice.

    if (
      targetIndex < 0 ||
      targetIndex >= this.totalDestinations
    ) {
      return;
    }

    // Evitar transiciones simultáneas.

    if (
      this.transitioning() ||
      targetIndex === this.currentIndex()
    ) {
      return;
    }

    this.clearTransitionTimer();

    // Comprobar las preferencias de accesibilidad.

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    // Activar la transición.

    this.transitioning.set(!reducedMotion);

    // Actualizar inmediatamente el destino.

    this.currentIndex.set(targetIndex);

    const destination = destinations[targetIndex];

    // Sincronizar con el mapa interactivo.

    this.selection.select(destination);

    // Evitar animaciones innecesarias.

    if (reducedMotion) {
      return;
    }

    // Finalizar la transición.

    this.transitionTimer = setTimeout(() => {

      this.transitioning.set(false);

      this.transitionTimer = null;

    }, this.transitionDuration);

  }

  // ========================================
  // DESCUBRIR DESTINO EN EL MAPA
  // ========================================

  discover(): void {

    const destination = this.active();

    if (!destination) {
      return;
    }

    this.selection.select(destination);

    this.selection.scrollToMap();

  }

  // ========================================
  // CREAR POSTAL
  // ========================================

  createPostcard(): void {

    const destination = this.active();

    if (!destination) {
      return;
    }

    this.selection.select(destination);

    this.postcard.select(destination);

    this.selection.scrollToStudio();

  }

  // ========================================
  // NAVEGACIÓN MEDIANTE TECLADO
  // ========================================

  @HostListener('keydown', ['$event'])
  onKey(event: KeyboardEvent): void {

    const target = event.target as HTMLElement | null;

    // No interferir con campos de texto.

    if (
      target?.closest(
        'input, textarea, select, [contenteditable="true"]'
      )
    ) {
      return;
    }

    if (event.key === 'ArrowRight') {

      event.preventDefault();

      this.next();

    }

    if (event.key === 'ArrowLeft') {

      event.preventDefault();

      this.prev();

    }

  }

  // ========================================
  // NAVEGACIÓN TÁCTIL
  // ========================================

  onTouchStart(event: TouchEvent): void {

    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    this.touchStartX = touch.clientX;

    this.touchStartY = touch.clientY;

  }

  onTouchEnd(event: TouchEvent): void {

    const touch = event.changedTouches[0];

    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - this.touchStartX;

    const deltaY = touch.clientY - this.touchStartY;

    // Permitir el desplazamiento vertical de la página.

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    const minimumSwipeDistance = 50;

    if (Math.abs(deltaX) < minimumSwipeDistance) {
      return;
    }

    if (deltaX < 0) {

      this.next();

    } else {

      this.prev();

    }

  }

  // ========================================
  // BARRA DE PROGRESO
  // ========================================

  progress(): number {

    if (!this.totalDestinations) {
      return 0;
    }

    return (
      (this.currentIndex() + 1) /
      this.totalDestinations
    ) * 100;

  }

  // ========================================
  // INDICADOR NUMÉRICO
  // ========================================

  displayNum(): string {

    return String(
      this.currentIndex() + 1
    ).padStart(2, '0');

  }

  // ========================================
  // LIMPIEZA DE TEMPORIZADORES
  // ========================================

  private clearTransitionTimer(): void {

    if (this.transitionTimer !== null) {

      clearTimeout(this.transitionTimer);

      this.transitionTimer = null;

    }

  }

  // ========================================
  // DESTRUCCIÓN DEL COMPONENTE
  // ========================================

  ngOnDestroy(): void {

    this.clearTransitionTimer();

  }

}