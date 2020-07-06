import { Coordinate } from './Coordinate';

export class Footprint{
    constructor(
        public id: number,
        public coordinates: Coordinate[]
    ){}
}