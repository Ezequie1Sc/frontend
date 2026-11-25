import { Injectable } from '@angular/core';
import { Destination } from '../../data/destinations.data';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  readonly cloud = 'v2wvhvul';

  cloudUrl(
    destination: Destination,
    width = 1200,
    effect = ''
  ): string {

    const height = Math.round(width * 0.62);

    const transformations = [
      'c_fill',
      `w_${width}`,
      `h_${height}`,
      'q_auto',
      'f_auto'
    ];

    if (effect) {
      transformations.push(effect);
    }

    return (
      `https://res.cloudinary.com/${this.cloud}/image/fetch/` +
      `${transformations.join(',')}/` +
      encodeURIComponent(destination.url)
    );
  }

  fallback(event: Event, destination: Destination): void {

    const image = event.target as HTMLImageElement;

    const originalUrl = new URL(
      destination.url,
      document.baseURI
    ).href;

    image.style.visibility = 'visible';

    if (image.src !== originalUrl) {
      image.src = originalUrl;
      return;
    }

    image.dataset['unavailable'] = 'true';
  }
}