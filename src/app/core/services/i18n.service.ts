import { Injectable, signal } from '@angular/core';
export type Lang = 'es' | 'en';
@Injectable({ providedIn: 'root' })
export class I18nService {
    private currentLang = signal<Lang>('es');
    lang = this.currentLang.asReadonly();
    private translations: Record<Lang, any> = {
        es: {},
        en: {}
    };
    constructor() {
        const saved = localStorage.getItem('raices-lang') as Lang;
        if (saved === 'es' || saved === 'en') {
            this.currentLang.set(saved);
        }
        this.loadTranslations();
        document.documentElement.lang = this.currentLang() === "es" ? "es-MX" : "en";
    }
    async loadTranslations() {
        // In a real app, load from /assets/i18n or public/i18n
        // For this scaffold, we embed key translations
        this.translations.es = {
            common: {
                beginJourney: 'COMIENZA TU VIAJE',
                explore: 'Explorar',
                studio: 'RAÍCES Studio',
                passport: 'Pasaporte',
                language: 'Idioma'
            },
            home: {
                mexicoCampeche: 'MÉXICO — CAMPECHE',
                slogan: 'Una tierra de historias vivas.',
                subtitle: 'Descubre lo extraordinario de nuestras raíces.'
            }
        };
        this.translations.en = {
            common: {
                beginJourney: 'BEGIN YOUR JOURNEY',
                explore: 'Explore',
                studio: 'RAÍCES Studio',
                passport: 'Passport',
                language: 'Language'
            },
            home: {
                mexicoCampeche: 'MEXICO — CAMPECHE',
                slogan: 'A land of living stories.',
                subtitle: 'Discover the extraordinary within our roots.'
            }
        };
    }
    t(key: string): string {
        const [ns, k] = key.split('.');
        return this.translations[this.currentLang()]?.[ns]?.[k] || key;
    }
    setLang(lang: Lang) {
        this.currentLang.set(lang);
        localStorage.setItem('raices-lang', lang);
        document.documentElement.lang = lang === 'es' ? 'es-MX' : 'en';
    }
}
