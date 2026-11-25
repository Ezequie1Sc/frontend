
import {
    Component,
    inject,
    signal
} from '@angular/core';

import {
    PostcardService
} from '../../../core/services/postcard.service';

import {
    CloudinaryService
} from '../../../core/services/cloudinary.service';

import {
    Destination
} from '../../../data/destinations.data';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [],
    templateUrl: './footer.html',
    styleUrl: './footer.css'
})
export class Footer {

    // ========================================
    // SERVICIOS
    // ========================================

    readonly state = inject(PostcardService);

    readonly media = inject(CloudinaryService);

    // ========================================
    // INFORMACIÓN DEL PROYECTO
    // ========================================

    readonly year = new Date().getFullYear();

    readonly githubUrl =
        'https://github.com/Ezequie1Sc';

    // ========================================
    // ESTADO DE LOS CRÉDITOS
    // ========================================

    readonly creditsOpen = signal(false);

    toggleCredits(): void {

        this.creditsOpen.update(
            current => !current
        );

    }

    // ========================================
    // FOTOGRAFÍA EXCLUSIVA DEL FOOTER
    // ========================================

    readonly backgroundDestination: Destination = {

        id: 'footer-sunset',

        name: 'Malecón de Campeche',

        categoryEs: 'Paisaje costero',

        categoryEn: 'Coastal landscape',

        descriptionEs:
            'Atardecer sobre el Golfo de México.',

        descriptionEn:
            'Sunset over the Gulf of Mexico.',

        url:
            'https://commons.wikimedia.org/wiki/Special:FilePath/Atardecer_en_el_Malec%C3%B3n_de_Campeche.jpg',

        source:
            'https://commons.wikimedia.org/wiki/File:Atardecer_en_el_Malec%C3%B3n_de_Campeche.jpg',

        author: 'EstherWikipedian',

        license: '4.0',

        lat: 19.85,

        lon: -90.53,

        alt: 'Atardecer en el malecón de Campeche'

    };

    // ========================================
    // OPTIMIZACIÓN CON CLOUDINARY
    // ========================================

    readonly backgroundImage = this.media.cloudUrl(
        this.backgroundDestination,
        1920
    );

    // ========================================
    // RECUPERACIÓN DE IMAGEN
    // ========================================

    onBackgroundError(event: Event): void {

        const image = event.target as HTMLImageElement;

        // Si Cloudinary falla, intentar cargar
        // directamente desde Wikimedia Commons.

        if (image.dataset['fallback'] !== 'true') {

            image.dataset['fallback'] = 'true';

            image.src = this.backgroundDestination.url;

            return;

        }

        // Si ambas fuentes fallan, conservar
        // el fondo verde oscuro del footer.

        image.style.display = 'none';

        console.warn(
            'No se pudo cargar la fotografía del footer.'
        );

    }

}
