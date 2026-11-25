
import {
    Component,
    inject,
    signal,
    viewChild,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
    PostcardService
} from '../../../core/services/postcard.service';

import {
    CloudinaryService
} from '../../../core/services/cloudinary.service';

import gsap from 'gsap';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [],
    templateUrl: './hero.html',
    styleUrl: './hero.css'
})
export class Hero implements AfterViewInit, OnDestroy {

    // ========================================
    // SERVICIOS
    // ========================================

    readonly state = inject(PostcardService);
    readonly media = inject(CloudinaryService);

    private readonly platformId = inject(PLATFORM_ID);

    // ========================================
    // REFERENCIAS DEL DOM
    // ========================================

    readonly heroVideo =
        viewChild<ElementRef<HTMLVideoElement>>('heroVideo');

    readonly heroCopy =
        viewChild<ElementRef<HTMLElement>>('heroCopy');

    // ========================================
    // ESTADO DEL VIDEO
    // ========================================

    readonly videoReady = signal(false);

    private animation?: gsap.core.Timeline;

    private motionPreference?: MediaQueryList;

    // ========================================
    // INICIALIZACIÓN
    // ========================================

    ngAfterViewInit(): void {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.motionPreference = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );

        this.motionPreference.addEventListener(
            'change',
            this.onMotionChange
        );

        this.configureVideo();
        this.animateContent();

    }

    // ========================================
    // CONFIGURACIÓN DEL VIDEO
    // ========================================

    private configureVideo(): void {

        const video = this.heroVideo()?.nativeElement;

        if (!video) {
            return;
        }

        // Garantizar que nunca reproduzca sonido.

        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;

        video.loop = true;
        video.playsInline = true;
        video.controls = false;

        // Respetar las preferencias de accesibilidad.

        if (this.motionPreference?.matches) {

            video.pause();
            this.videoReady.set(false);

            return;

        }

        // Iniciar la reproducción automáticamente.

        video.play().catch(() => {

            // Si el navegador bloquea el autoplay,
            // se mantiene la imagen de respaldo.

            this.videoReady.set(false);

        });

    }

    // ========================================
    // VIDEO DISPONIBLE
    // ========================================

    onVideoReady(): void {

        if (this.motionPreference?.matches) {

            this.heroVideo()?.nativeElement.pause();
            this.videoReady.set(false);

            return;

        }

        this.videoReady.set(true);

    }

    // ========================================
    // ERROR DE REPRODUCCIÓN
    // ========================================

    onVideoError(): void {

        this.videoReady.set(false);

    }

    // ========================================
    // PREFERENCIAS DE MOVIMIENTO
    // ========================================

    private readonly onMotionChange = (): void => {

        this.configureVideo();

        if (this.motionPreference?.matches) {

            this.animation?.progress(1).kill();

        }

    };

    // ========================================
    // ANIMACIONES DE ENTRADA
    // ========================================

    private animateContent(): void {

        if (this.motionPreference?.matches) {
            return;
        }

        const container = this.heroCopy()?.nativeElement;

        if (!container) {
            return;
        }

        const heading = container.querySelector('h1');
        const paragraph = container.querySelector('p');
        const button = container.querySelector('.hero-cta');

        if (!heading || !paragraph || !button) {
            return;
        }

        this.animation = gsap.timeline({
            defaults: {
                ease: 'power3.out'
            }
        });

        this.animation

            .from(heading, {
                y: 45,
                opacity: 0,
                duration: 1.3
            })

            .from(paragraph, {
                y: 20,
                opacity: 0,
                duration: 0.9
            }, '-=0.8')

            .from(button, {
                y: 15,
                opacity: 0,
                duration: 0.8
            }, '-=0.6');

    }

    // ========================================
    // LIMPIEZA
    // ========================================

    ngOnDestroy(): void {

        this.animation?.kill();

        this.heroVideo()?.nativeElement.pause();

        this.motionPreference?.removeEventListener(
            'change',
            this.onMotionChange
        );

    }

}