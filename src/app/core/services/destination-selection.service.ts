import { Injectable, signal, computed } from '@angular/core';
import { destinations, Destination } from '../../data/destinations.data';
@Injectable({ providedIn: 'root' })
export class DestinationSelectionService {
    private _selected = signal<Destination>(destinations[0]);
    selected = this._selected.asReadonly();
    select(dest: Destination) {
        this._selected.set(dest);
    }
    selectById(id: string) {
        const d = destinations.find(x => x.id === id);
        if (d)
            this._selected.set(d);
    }
    next() {
        const idx = destinations.findIndex(d => d.id === this._selected().id);
        const nextIdx = (idx + 1) % destinations.length;
        this._selected.set(destinations[nextIdx]);
    }
    prev() {
        const idx = destinations.findIndex(d => d.id === this._selected().id);
        const prevIdx = (idx - 1 + destinations.length) % destinations.length;
        this._selected.set(destinations[prevIdx]);
    }
    getIndex() {
        return destinations.findIndex(d => d.id === this._selected().id);
    }
    scrollToMap() {
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    scrollToStudio() {
        document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
