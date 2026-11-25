import {
  Injectable,
  signal,
  computed,
  effect
} from '@angular/core';

import JSZip from 'jszip';

import {
  destinations,
  Destination
} from '../../data/destinations.data';

import { I18nService } from './i18n.service';
import { CloudinaryService } from './cloudinary.service';
import { DestinationSelectionService } from './destination-selection.service';

type PostcardSide = 'front' | 'back';
type ExportMode = 'front' | 'back' | 'both';

@Injectable({ providedIn: 'root' })
export class PostcardService {

  // ========================================
  // ESTADO
  // ========================================

  readonly destinations = destinations;

  readonly filter = signal('');
  readonly message = signal('');
  readonly recipient = signal('');
  readonly sender = signal('');

  readonly side = signal<PostcardSide>('front');

  readonly failed = signal(false);
  readonly busy = signal(false);
  readonly status = signal('');

  private readonly storageKey = 'raices-postcard-v2';

  // ========================================
  // FILTROS CLOUDINARY
  // ========================================

  readonly filters = [
    {
      id: '',
      es: 'Original',
      en: 'Original'
    },
    {
      id: 'e_grayscale',
      es: 'Monocromo',
      en: 'Monochrome'
    },
    {
      id: 'e_sepia:70',
      es: 'Sepia',
      en: 'Sepia'
    },
    {
      id: 'e_saturation:35',
      es: 'Vivo',
      en: 'Vivid'
    }
  ];

  constructor(
    public i18n: I18nService,
    public media: CloudinaryService,
    private selection: DestinationSelectionService
  ) {

    this.restoreDraft();

    effect(() => {
      this.preview();
      this.failed.set(false);
      this.status.set('');
    });

    effect(() => {

      const draft = {
        message: this.message(),
        recipient: this.recipient(),
        sender: this.sender(),
        filter: this.filter()
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            this.storageKey,
            JSON.stringify(draft)
          );
        } catch {
          // La postal sigue funcionando sin almacenamiento.
        }
      }

    });

  }

  // ========================================
  // DESTINO SELECCIONADO
  // ========================================

  get selected() {
    return this.selection.selected;
  }

  readonly preview = computed(() =>
    this.media.cloudUrl(
      this.selection.selected(),
      1600,
      this.filter()
    )
  );

  readonly date = computed(() =>
    new Intl.DateTimeFormat(
      this.i18n.lang() === 'es' ? 'es-MX' : 'en-US',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ).format(new Date())
  );

  // ========================================
  // INTERNACIONALIZACIÓN
  // ========================================

  t(es: string, en: string): string {
    return this.i18n.lang() === 'es' ? es : en;
  }

  // ========================================
  // SELECCIÓN Y FILTROS
  // ========================================

  select(destination: Destination): void {

    this.selection.select(destination);
    this.failed.set(false);
    this.status.set('');

  }

  selectById(id: string): void {

    const destination = this.destinations.find(
      item => item.id === id
    );

    if (destination) {
      this.select(destination);
    }

  }

  changeFilter(value: string): void {

    if (!this.filters.some(item => item.id === value)) {
      return;
    }

    this.filter.set(value);
    this.failed.set(false);
    this.status.set('');

  }

  // ========================================
  // GIRO DE POSTAL
  // ========================================

  flip(): void {

    this.side.update(value =>
      value === 'front' ? 'back' : 'front'
    );

  }

  showFront(): void {
    this.side.set('front');
  }

  showBack(): void {
    this.side.set('back');
  }

  // ========================================
  // ERRORES DE IMAGEN
  // ========================================

  previewError(event: Event): void {

    this.failed.set(true);

    this.media.fallback(
      event,
      this.selected()
    );

  }

  // ========================================
  // BORRADOR LOCAL
  // ========================================

  private restoreDraft(): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      const saved = localStorage.getItem(
        this.storageKey
      );

      if (!saved) {
        return;
      }

      const draft = JSON.parse(saved);

      if (typeof draft.message === 'string') {
        this.message.set(draft.message.slice(0, 250));
      }

      if (typeof draft.recipient === 'string') {
        this.recipient.set(draft.recipient.slice(0, 50));
      }

      if (typeof draft.sender === 'string') {
        this.sender.set(draft.sender.slice(0, 50));
      }

      if (
        this.filters.some(item => item.id === draft.filter)
      ) {
        this.filter.set(draft.filter);
      }

    } catch {
      // Ignorar borradores inválidos.
    }

  }

  reset(): void {

    this.message.set('');
    this.recipient.set('');
    this.sender.set('');
    this.filter.set('');
    this.side.set('front');
    this.status.set('');
    this.failed.set(false);

  }

  // ========================================
  // CARGAR IMAGEN
  // ========================================

  private loadImage(url: string): Promise<HTMLImageElement> {

    return new Promise((resolve, reject) => {

      const image = new Image();

      image.crossOrigin = 'anonymous';

      image.onload = () => resolve(image);

      image.onerror = () =>
        reject(new Error('Image unavailable'));

      image.src = url;

    });

  }

  // ========================================
  // CREAR CANVAS
  // ========================================

  private createCanvas() {

    const canvas = document.createElement('canvas');

    canvas.width = 1600;
    canvas.height = 1000;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas unavailable');
    }

    ctx.fillStyle = '#F6F3EB';
    ctx.fillRect(0, 0, 1600, 1000);

    return { canvas, ctx };

  }

  // ========================================
  // IMAGEN CON OBJECT-FIT COVER
  // ========================================

  private drawCover(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {

    const scale = Math.max(
      width / image.naturalWidth,
      height / image.naturalHeight
    );

    const sourceWidth = width / scale;
    const sourceHeight = height / scale;

    const sourceX =
      (image.naturalWidth - sourceWidth) / 2;

    const sourceY =
      (image.naturalHeight - sourceHeight) / 2;

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height
    );

  }

  // ========================================
  // TEXTO MULTILÍNEA
  // ========================================

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {

    for (const paragraph of text.split('\n')) {

      let line = '';

      for (const character of paragraph) {

        const candidate = line + character;

        if (
          line &&
          ctx.measureText(candidate).width > maxWidth
        ) {

          const space = line.lastIndexOf(' ');

          if (space > 0) {
            ctx.fillText(line.slice(0, space), x, y);
            line = line.slice(space + 1) + character;
          } else {
            ctx.fillText(line, x, y);
            line = character;
          }

          y += lineHeight;

        } else {
          line = candidate;
        }

      }

      ctx.fillText(line, x, y);
      y += lineHeight;

    }

  }

  // ========================================
  // EXPORTAR CARA FRONTAL
  // ========================================

  private async renderFront(
    destination: Destination,
    imageUrl: string
  ): Promise<Blob> {

    const { canvas, ctx } = this.createCanvas();

    const image = await this.loadImage(imageUrl);

    this.drawCover(
      ctx,
      image,
      32,
      32,
      1536,
      720
    );

    ctx.fillStyle = '#284B40';
    ctx.font = '60px Georgia';

    ctx.fillText(
      destination.name,
      55,
      835,
      1490
    );

    ctx.font = '23px Arial';

    ctx.fillText(
      'RAÍCES — CAMPECHE, MÉXICO',
      55,
      885
    );

    ctx.fillStyle = '#666C65';
    ctx.font = '18px Arial';

    ctx.fillText(
      `${destination.author} · CC BY-SA ${destination.license} · ${this.t('Imagen adaptada', 'Adapted image')}`,
      55,
      930,
      1490
    );

    ctx.font = '15px Arial';

    ctx.fillText(
      destination.source,
      55,
      955,
      1490
    );

    ctx.fillText(
      `https://creativecommons.org/licenses/by-sa/${destination.license}/`,
      55,
      980,
      1490
    );

    return this.toBlob(canvas);

  }

  // ========================================
  // EXPORTAR CARA POSTERIOR
  // ========================================

  private async renderBack(
    destination: Destination,
    message: string,
    recipient: string,
    sender: string
  ): Promise<Blob> {

    const { canvas, ctx } = this.createCanvas();

    // Marco exterior.
    ctx.strokeStyle = '#D5CCBB';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 1530, 930);

    // Marca.
    ctx.fillStyle = '#284B40';
    ctx.font = '45px Georgia';
    ctx.fillText('RAÍCES', 90, 120);

    ctx.font = '20px Arial';
    ctx.fillText('CAMPECHE · MÉXICO', 90, 160);

    // División central.
    ctx.strokeStyle = '#C9C1B1';
    ctx.beginPath();
    ctx.moveTo(800, 210);
    ctx.lineTo(800, 870);
    ctx.stroke();

    // Dedicatoria.
    ctx.fillStyle = '#284B40';
    ctx.font = 'italic 35px Georgia';

    this.wrapText(
      ctx,
      message || this.t(
        'Recuerdos de Campeche.',
        'Memories of Campeche.'
      ),
      90,
      260,
      640,
      44
    );

    // Remitente.
    ctx.font = '25px Georgia';

    ctx.fillText(
      sender
        ? `${this.t('De', 'From')}: ${sender}`
        : '',
      90,
      840,
      640
    );

    // Sello.
    ctx.fillStyle = '#E6D6BD';
    ctx.fillRect(1270, 90, 220, 240);

    ctx.strokeStyle = '#284B40';
    ctx.setLineDash([6, 5]);
    ctx.strokeRect(1280, 100, 200, 220);
    ctx.setLineDash([]);

    ctx.fillStyle = '#284B40';
    ctx.textAlign = 'center';
    ctx.font = '28px Georgia';
    ctx.fillText('RAÍCES', 1380, 145);

    // Ilustración arquitectónica.
    ctx.beginPath();
    ctx.moveTo(1315, 260);
    ctx.lineTo(1445, 260);
    ctx.lineTo(1445, 240);
    ctx.lineTo(1425, 240);
    ctx.lineTo(1425, 220);
    ctx.lineTo(1405, 220);
    ctx.lineTo(1405, 200);
    ctx.lineTo(1355, 200);
    ctx.lineTo(1355, 220);
    ctx.lineTo(1335, 220);
    ctx.lineTo(1335, 240);
    ctx.lineTo(1315, 240);
    ctx.closePath();
    ctx.stroke();

    ctx.font = '16px Arial';
    ctx.fillText('CAMPECHE', 1380, 300);
    ctx.textAlign = 'left';

    // Destinatario.
    ctx.font = '24px Arial';

    ctx.fillText(
      this.t('Para:', 'To:'),
      870,
      440
    );

    ctx.font = '35px Georgia';

    ctx.fillText(
      recipient,
      870,
      500,
      620
    );

    // Líneas postales.
    ctx.strokeStyle = '#C9C1B1';

    for (const y of [525, 620, 715]) {

      ctx.beginPath();
      ctx.moveTo(870, y);
      ctx.lineTo(1490, y);
      ctx.stroke();

    }

    ctx.font = '24px Georgia';

    ctx.fillText(
      destination.name,
      870,
      810,
      620
    );

    ctx.fillStyle = '#777B72';
    ctx.font = '20px Arial';

    ctx.fillText(
      this.date(),
      870,
      850
    );

    return this.toBlob(canvas);

  }

  // ========================================
  // CONVERTIR CANVAS A PNG
  // ========================================

  private toBlob(canvas: HTMLCanvasElement): Promise<Blob> {

    return new Promise((resolve, reject) => {

      canvas.toBlob(blob => {

        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Export failed'));
        }

      }, 'image/png');

    });

  }

  // ========================================
  // DESCARGAR ARCHIVO
  // ========================================

  private saveFile(blob: Blob, filename: string): void {

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);

  }

  // ========================================
  // DESCARGAR POSTAL
  // ========================================

  async download(mode: ExportMode = 'front'): Promise<void> {

    if (this.busy()) {
      return;
    }

    this.busy.set(true);
    this.status.set('');

    const destination = this.selected();
    const imageUrl = this.preview();
    const message = this.message();
    const recipient = this.recipient();
    const sender = this.sender();

    const filename = `raices-${destination.id}`;

    try {

      if (mode === 'front') {

        const front = await this.renderFront(
          destination,
          imageUrl
        );

        this.saveFile(
          front,
          `${filename}-front.png`
        );

      } else if (mode === 'back') {

        const back = await this.renderBack(
          destination,
          message,
          recipient,
          sender
        );

        this.saveFile(
          back,
          `${filename}-back.png`
        );

      } else {

        const [front, back] = await Promise.all([

          this.renderFront(
            destination,
            imageUrl
          ),

          this.renderBack(
            destination,
            message,
            recipient,
            sender
          )

        ]);

        const zip = new JSZip();

        zip.file(`${filename}-front.png`, front);
        zip.file(`${filename}-back.png`, back);

        const archive = await zip.generateAsync({
          type: 'blob'
        });

        this.saveFile(
          archive,
          `${filename}.zip`
        );

      }

      this.status.set(
        this.t(
          'Postal descargada correctamente.',
          'Postcard downloaded successfully.'
        )
      );

    } catch {

      this.status.set(
        this.t(
          'No se pudo exportar la postal. Verifica la disponibilidad de Cloudinary y CORS.',
          'Could not export the postcard. Check Cloudinary availability and CORS.'
        )
      );

    } finally {

      this.busy.set(false);

    }

  }

}