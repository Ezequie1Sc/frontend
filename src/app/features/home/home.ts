import { Component } from '@angular/core';
import { Hero } from '../../shared/components/hero/hero';
import { Introduction } from '../../shared/components/introduction/introduction';
import { Explore } from '../explore/explore';
import { InteractiveMap } from '../../shared/components/interactive-map/interactive-map';
import { Postcards } from '../postcards/postcards';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [Hero, Introduction, Explore, InteractiveMap, Postcards],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class Home {
}
