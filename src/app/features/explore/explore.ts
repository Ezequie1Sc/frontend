import { Component } from '@angular/core';
import { DestinationSlider } from './components/destination-slider/destination-slider';
@Component({
    selector: 'app-explore',
    standalone: true,
    imports: [DestinationSlider],
    templateUrl: './explore.html',
    styleUrl: './explore.css'
})
export class Explore {
}
