import {
  Component,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  PostcardService
} from '../../core/services/postcard.service';

import {
  CloudinaryService
} from '../../core/services/cloudinary.service';

@Component({
  selector: 'app-postcards',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './postcards.html',
  styleUrl: './postcards.css'
})
export class Postcards {

  readonly state = inject(PostcardService);

  readonly media = inject(CloudinaryService);

}