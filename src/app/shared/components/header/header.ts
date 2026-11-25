
import {
    Component,
    inject,
    signal,
    HostListener,
    AfterViewInit,
    OnDestroy,
    PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
    PostcardService
} from '../../../core/services/postcard.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header implements AfterViewInit, OnDestroy {

    // ========================================
    // SERVICIOS
    // ========================================

    readonly state = inject(PostcardService);

    private readonly platformId = inject(PLATFORM_ID);

    // ========================================
    // ESTADO
    // ========================================

    readonly menuOpen = signal(false);

    readonly scrolled = signal(false);

    readonly activeSection = signal('home');

    private observer?: IntersectionObserver;

    // ========================================
    // NAVEGACIÓN
    // ========================================

    readonly links = [
        {
            id: 'explore',
            es: 'Explorar',
            en: 'Explore'
        },
        {
            id: 'map',
            es: 'Mapa',
            en: 'Map'
        },
        {
            id: 'studio',
            es: 'Postales',
            en: 'Postcards'
        },
        {
            id: 'credits',
            es: 'Créditos',
            en: 'Credits'
        }
    ];

    // ========================================
    // INICIALIZACIÓN
    // ========================================

    ngAfterViewInit(): void {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.onScroll();

        this.observeSections();

    }

    // ========================================
    // MENÚ MÓVIL
    // ========================================

    toggleMenu(): void {

        this.menuOpen.update(value => !value);

    }

    closeMenu(): void {

        this.menuOpen.set(false);

    }

    // ========================================
    // NAVEGACIÓN ENTRE SECCIONES
    // ========================================

    navigate(sectionId: string): void {

        this.activeSection.set(sectionId);

        this.closeMenu();

    }

    // ========================================
    // CAMBIO DE IDIOMA
    // ========================================

    changeLanguage(language: 'es' | 'en'): void {

        this.state.i18n.setLang(language);

    }

    // ========================================
    // DETECTAR SCROLL
    // ========================================

    @HostListener('window:scroll')
    onScroll(): void {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.scrolled.set(window.scrollY > 30);

        if (window.scrollY < 100) {

            this.activeSection.set('home');

        }

    }

    // ========================================
    // DETECTAR SECCIÓN ACTIVA
    // ========================================

    private observeSections(): void {

        if (typeof IntersectionObserver === 'undefined') {
            return;
        }

        this.observer = new IntersectionObserver(
            entries => {

                for (const entry of entries) {

                    if (entry.isIntersecting) {

                        this.activeSection.set(
                            entry.target.id
                        );

                    }

                }

            },
            {
                root: null,
                rootMargin: '-15% 0px -55% 0px',
                threshold: 0
            }
        );

        for (const link of this.links) {

            const section = document.getElementById(
                link.id
            );

            if (section) {

                this.observer.observe(section);

            }

        }

    }

    // ========================================
    // CERRAR CON ESCAPE
    // ========================================

    @HostListener('document:keydown.escape')
    onEscape(): void {

        this.closeMenu();

    }

    // ========================================
    // CAMBIO DE TAMAÑO DE PANTALLA
    // ========================================

    @HostListener('window:resize')
    onResize(): void {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (window.innerWidth > 850) {

            this.closeMenu();

        }

    }

    // ========================================
    // LIMPIEZA
    // ========================================

    ngOnDestroy(): void {

        this.observer?.disconnect();

    }

}
