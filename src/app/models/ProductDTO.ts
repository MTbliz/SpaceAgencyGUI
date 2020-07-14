import { Mission } from './Mission';
import { FootprintDTO } from './FootprintDTO';

export class ProductDTO {
    constructor(
        public mission: Mission,
        public acquisitionDate: Date,
        public footprint: FootprintDTO,
        public price: number,
        public file: File
    ) { }
}