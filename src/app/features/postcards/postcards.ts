import { Component, inject } from '@angular/core';
import { PostcardService } from '../../core/services/postcard.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { FormsModule } from '@angular/forms';
@Component({ selector: 'app-postcards', standalone: true, imports: [FormsModule], templateUrl: './postcards.html', styleUrl: './postcards.css' })
export class Postcards {
    state = inject(PostcardService);
    media = inject(CloudinaryService);
}
