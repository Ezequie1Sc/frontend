import {
  Component,
  inject,
  signal,
  computed,
  OnInit
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  destinations,
  Destination
} from '../../../data/destinations.data';

import {
  DestinationSelectionService
} from '../../../core/services/destination-selection.service';

import {
  CloudinaryService
} from '../../../core/services/cloudinary.service';

import {
  I18nService
} from '../../../core/services/i18n.service';

import {
  PostcardService
} from '../../../core/services/postcard.service';

type Position = [number, number];
type Ring = Position[];
type Polygon = Ring[];

interface GeoGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: Polygon | Polygon[];
}

interface GeoFeature {
  geometry: GeoGeometry;
}

interface GeoCollection {
  type: string;
  features: GeoFeature[];
}

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  templateUrl: './interactive-map.html',
  styleUrl: './interactive-map.css'
})
export class InteractiveMap implements OnInit {

  // ========================================
  // SERVICIOS
  // ========================================

  private readonly http = inject(HttpClient);
  private readonly selection = inject(DestinationSelectionService);
  private readonly media = inject(CloudinaryService);
  private readonly i18n = inject(I18nService);
  private readonly postcard = inject(PostcardService);

  // ========================================
  // ESTADO
  // ========================================

  readonly destinations = destinations;

  readonly selected = this.selection.selected;
  readonly lang = this.i18n.lang;
  readonly cloud = this.media;

  readonly loaded = signal(false);
  readonly mapError = signal(false);
  readonly geoPaths = signal<string[]>([]);

  readonly Math = Math;

  // ========================================
  // CONFIGURACIÓN GEOGRÁFICA
  // ========================================

  private readonly width = 600;
  private readonly height = 600;
  private readonly padding = 35;

  private readonly bounds = signal({
    minLon: -92.5,
    maxLon: -89.0,
    minLat: 17.8,
    maxLat: 20.9
  });

  // ========================================
  // MARCADORES
  // ========================================

  readonly markers = computed(() => {

    return this.destinations.map(dest => {

      const [x, y] = this.project(
        dest.lon,
        dest.lat
      );

      return {
        dest,
        x,
        y
      };

    });

  });

  // ========================================
  // TRADUCCIONES
  // ========================================

  t(es: string, en: string): string {

    return this.lang() === 'es' ? es : en;

  }

  // ========================================
  // INICIALIZACIÓN
  // ========================================

  ngOnInit(): void {

    this.loadMap();

  }

  // ========================================
  // CARGAR GEOJSON
  // ========================================

  private loadMap(): void {

    this.http
      .get<GeoCollection>('maps/campeche.geojson')
      .subscribe({

        next: data => {

          const polygons: Polygon[] = [];

          for (const feature of data.features ?? []) {

            const geometry = feature.geometry;

            if (!geometry) {
              continue;
            }

            if (geometry.type === 'Polygon') {

              polygons.push(
                geometry.coordinates as Polygon
              );

            }

            if (geometry.type === 'MultiPolygon') {

              polygons.push(
                ...geometry.coordinates as Polygon[]
              );

            }

          }

          const validPolygons = polygons
            .map(polygon =>
              polygon
                .map(ring => this.normalizeRing(ring))
                .filter(ring => ring.length >= 4)
            )
            .filter(polygon => polygon.length > 0);

          if (!validPolygons.length) {

            console.error(
              'El GeoJSON no contiene polígonos válidos.'
            );

            this.mapError.set(true);
            this.loaded.set(true);

            return;

          }

          this.calculateBounds(validPolygons);

          const paths = validPolygons.map(
            polygon => this.polygonToPath(polygon)
          );

          this.geoPaths.set(paths);
          this.mapError.set(false);
          this.loaded.set(true);

        },

        error: error => {

          console.error(
            'Error al cargar el mapa de Campeche:',
            error
          );

          this.mapError.set(true);
          this.loaded.set(true);

        }

      });

  }

  // ========================================
  // NORMALIZAR POLÍGONOS
  // ========================================

  private normalizeRing(ring: Ring): Ring {

    if (!Array.isArray(ring)) {
      return [];
    }

    const validPoints = ring.filter(point =>
      Array.isArray(point) &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1])
    );

    const uniquePoints = new Set(
      validPoints.map(point => point.join(','))
    );

    if (uniquePoints.size < 3) {
      return [];
    }

    const result = [...validPoints];

    const first = result[0];
    const last = result[result.length - 1];

    if (
      first[0] !== last[0] ||
      first[1] !== last[1]
    ) {

      result.push([...first] as Position);

    }

    return result;

  }

  // ========================================
  // CALCULAR LÍMITES AUTOMÁTICAMENTE
  // ========================================

  private calculateBounds(polygons: Polygon[]): void {

    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const polygon of polygons) {

      for (const ring of polygon) {

        for (const [lon, lat] of ring) {

          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);

          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);

        }

      }

    }

    if (
      Number.isFinite(minLon) &&
      Number.isFinite(maxLon) &&
      Number.isFinite(minLat) &&
      Number.isFinite(maxLat) &&
      maxLon > minLon &&
      maxLat > minLat
    ) {

      this.bounds.set({
        minLon,
        maxLon,
        minLat,
        maxLat
      });

    }

  }

  // ========================================
  // PROYECCIÓN GEOGRÁFICA
  // ========================================

  private project(
    lon: number,
    lat: number
  ): Position {

    const bounds = this.bounds();

    const averageLatitude =
      (bounds.minLat + bounds.maxLat) / 2;

    const correction = Math.cos(
      averageLatitude * Math.PI / 180
    );

    const geographicWidth =
      (bounds.maxLon - bounds.minLon) * correction;

    const geographicHeight =
      bounds.maxLat - bounds.minLat;

    const availableWidth =
      this.width - this.padding * 2;

    const availableHeight =
      this.height - this.padding * 2;

    const scale = Math.min(
      availableWidth / geographicWidth,
      availableHeight / geographicHeight
    );

    const offsetX =
      (this.width - geographicWidth * scale) / 2;

    const offsetY =
      (this.height - geographicHeight * scale) / 2;

    const x =
      offsetX +
      (lon - bounds.minLon) * correction * scale;

    const y =
      offsetY +
      (bounds.maxLat - lat) * scale;

    return [x, y];

  }

  // ========================================
  // CONVERTIR GEOJSON A SVG
  // ========================================

  private polygonToPath(polygon: Polygon): string {

    return polygon
      .map(ring => {

        const commands = ring.map(
          ([lon, lat], index) => {

            const [x, y] = this.project(lon, lat);

            return (
              `${index === 0 ? 'M' : 'L'}` +
              `${x.toFixed(2)},${y.toFixed(2)}`
            );

          }
        );

        return commands.join(' ') + ' Z';

      })
      .join(' ');

  }

  // ========================================
  // NAVEGACIÓN
  // ========================================

  select(destination: Destination): void {

    this.selection.select(destination);

  }

  next(): void {

    this.selection.next();

  }

  prev(): void {

    this.selection.prev();

  }

  isActive(destination: Destination): boolean {

    return this.selected().id === destination.id;

  }

  // ========================================
  // CREAR POSTAL
  // ========================================

  createPostcard(): void {

    this.postcard.select(this.selected());

    this.selection.scrollToStudio();

  }

}