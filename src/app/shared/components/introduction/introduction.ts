import { Component, inject } from '@angular/core';
import { PostcardService } from '../../../core/services/postcard.service';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
@Component({ selector: 'app-introduction', standalone: true, imports: [], templateUrl: './introduction.html', styleUrl: './introduction.css' })
export class Introduction {
    state = inject(PostcardService);
    media = inject(CloudinaryService);
}
