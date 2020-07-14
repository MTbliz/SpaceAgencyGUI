import { Mission } from './Mission';
import { Footprint } from './Footprint';

export class Product {
    constructor(
        public id: number,
        public mission: Mission,
        public acquisitionDate: Date,
        public footprint: Footprint,
        public price: number,
        public url: string
    ) { }
}