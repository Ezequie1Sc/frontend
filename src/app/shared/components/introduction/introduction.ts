import { Component, inject } from '@angular/core';
import { PostcardService } from '../../../core/services/postcard.service';

interface EditorialPostcard {
  id: string;
  name: string;
  descriptionEs: string;
  descriptionEn: string;
  altEs: string;
  altEn: string;
  file: string;
  author: string;
  license: string;
  position: string;
}

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [],
  templateUrl: './introduction.html',
  styleUrl: './introduction.css'
})
export class Introduction {

  readonly state = inject(PostcardService);

  readonly postcards: EditorialPostcard[] = [

    {
      id: 'becal',
      name: 'Bécal',
      descriptionEs: 'Tradiciones que perduran',
      descriptionEn: 'Enduring traditions',
      altEs: 'Iglesia de Bécal',
      altEn: 'Church of Bécal',
      file: 'Church at Bécal, Campeche, Mexico 3.jpg',
      author: 'Donna Yates',
      license: '4.0',
      position: 'center'
    },

    {
      id: 'hecelchakan',
      name: 'Hecelchakán',
      descriptionEs: 'El corazón de nuestras raíces',
      descriptionEn: 'The heart of our roots',
      altEs: 'Iglesia de Hecelchakán',
      altEn: 'Church of Hecelchakán',
      file: 'Iglesia de Hecelchacan, Campeche.jpg',
      author: 'Comisión Mexicana de Filmaciones',
      license: '2.0',
      position: 'center'
    },

    {
      id: 'palizada',
      name: 'Palizada',
      descriptionEs: 'Historias junto al río',
      descriptionEn: 'Stories by the river',
      altEs: 'Iglesia de Palizada',
      altEn: 'Church of Palizada',
      file: 'Iglesia Palizada Campeche - panoramio.jpg',
      author: 'panza.rayada',
      license: '3.0',
      position: 'center'
    },

    {
      id: 'campeche',
      name: 'Campeche',
      descriptionEs: 'Una ciudad pintada por la historia',
      descriptionEn: 'A city painted by history',
      altEs: 'Calle 59 del centro histórico de Campeche',
      altEn: '59th Street in historic Campeche',
      file: 'Calle 59 - Colonial Quarter, Campeche.jpg',
      author: 'Bernard DUPONT',
      license: '2.0',
      position: 'center'
    },

    {
      id: 'edzna',
      name: 'Edzná',
      descriptionEs: 'Ecos de una civilización',
      descriptionEn: 'Echoes of a civilization',
      altEs: 'Templo de los Mascarones en Edzná',
      altEn: 'Temple of the Masks in Edzná',
      file: 'Edzna Templo de los mascarones.JPG',
      author: 'Elelicht',
      license: '3.0',
      position: 'center'
    },

    {
      id: 'calakmul',
      name: 'Calakmul',
      descriptionEs: 'Entre la selva y el tiempo',
      descriptionEn: 'Between the jungle and time',
      altEs: 'Vista desde la Estructura II de Calakmul',
      altEn: 'View from Structure II at Calakmul',
      file: 'Calakmul from Estructura II.jpg',
      author: 'Fireplacetv',
      license: '4.0',
      position: 'center'
    },

    {
      id: 'isla-aguada',
      name: 'Isla Aguada',
      descriptionEs: 'Donde el mar encuentra la calma',
      descriptionEn: 'Where the sea finds peace',
      altEs: 'Paisaje costero de Isla Aguada',
      altEn: 'Coastal landscape of Isla Aguada',
      file: 'Colorful Sea Side - Isla Aguada Campeche.jpg',
      author: 'Bernard DUPONT',
      license: '2.0',
      position: 'center'
    }

  ];

  imageUrl(file: string): string {

    const filename = encodeURIComponent(
      file.replace(/ /g, '_')
    );

    return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=800`;

  }

  sourceUrl(file: string): string {

    const filename = encodeURIComponent(
      file.replace(/ /g, '_')
    );

    return `https://commons.wikimedia.org/wiki/File:${filename}`;

  }

  licenseUrl(license: string): string {

    return `https://creativecommons.org/licenses/by-sa/${license}/`;

  }

  formatNumber(index: number): string {

    return String(index + 1).padStart(2, '0');

  }

}