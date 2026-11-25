import { Injectable, signal, computed, effect } from '@angular/core';
import { destinations, Destination } from '../../data/destinations.data';
import { I18nService } from './i18n.service';
import { CloudinaryService } from './cloudinary.service';
import { DestinationSelectionService } from './destination-selection.service';
@Injectable({ providedIn: 'root' })
export class PostcardService {
    destinations = destinations;
    filter = signal('');
    message = signal('');
    failed = signal(false);
    busy = signal(false);
    status = signal('');
    filters = [
        { id: '', es: 'Original', en: 'Original' },
        { id: 'e_grayscale', es: 'Monocromo', en: 'Monochrome' },
        { id: 'e_sepia:70', es: 'Sepia', en: 'Sepia' },
        { id: 'e_saturation:35', es: 'Vivo', en: 'Vivid' }
    ];
    constructor(public i18n: I18nService, public media: CloudinaryService, private selection: DestinationSelectionService) {
        // Keep postcard selected in sync with shared selection
        effect(() => {
            // selection.selected is readonly signal; we just read it
        });
    }
    get selected() {
        return this.selection.selected;
    }
    t(es: string, en: string) {
        return this.i18n.lang() === 'es' ? es : en;
    }
    select(d: Destination) {
        this.selection.select(d);
        this.failed.set(false);
        this.status.set('');
    }
    changeFilter(v: string) {
        this.filter.set(v);
        this.failed.set(false);
        this.status.set('');
    }
    preview = computed(() => this.media.cloudUrl(this.selection.selected(), 1200, this.filter()));
    previewError(event: Event) {
        this.failed.set(true);
        this.media.fallback(event, this.selection.selected());
    }
    async download() {
        if (this.busy())
            return;
        this.busy.set(true);
        this.status.set('');
        const d = this.selection.selected();
        const url = this.preview();
        const msg = this.message().trim();
        const lang = this.i18n.lang();
        try {
            const im = new Image();
            im.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
                im.onload = () => resolve();
                im.onerror = () => reject(new Error('image'));
                im.src = url;
            });
            const c = document.createElement('canvas');
            c.width = 1200;
            c.height = 1040;
            const ctx = c.getContext('2d');
            if (!ctx)
                throw new Error('canvas');
            ctx.fillStyle = '#F6F3EB';
            ctx.fillRect(0, 0, 1200, 1040);
            ctx.drawImage(im, 30, 30, 1140, 707);
            ctx.fillStyle = '#284B40';
            ctx.font = '54px Georgia';
            ctx.fillText(d.name, 45, 810, 1110);
            ctx.font = '28px Arial';
            ctx.fillText(msg || (lang === 'es' ? 'Recuerdos de Campeche' : 'Memories of Campeche'), 45, 866, 1110);
            ctx.font = '19px Arial';
            ctx.fillText(`${d.author} • CC BY-SA ${d.license} • ${lang === 'es' ? 'Imagen adaptada' : 'Adapted image'}`, 45, 938, 1110);
            ctx.fillText(`https://creativecommons.org/licenses/by-sa/${d.license}/`, 45, 968, 1110);
            ctx.fillText(d.source, 45, 998, 1110);
            const blob = await new Promise<Blob | null>(resolve => c.toBlob(resolve, 'image/png'));
            if (!blob)
                throw new Error('export');
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `raices-${d.id}.png`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
            this.status.set(this.t('Postal descargada.', 'Postcard downloaded.'));
        }
        catch {
            this.status.set(this.t('No se pudo exportar. Verifica Remote Fetch y CORS de Cloudinary.', 'Export failed. Check Cloudinary Remote Fetch and CORS.'));
        }
        finally {
            this.busy.set(false);
        }
    }
}
