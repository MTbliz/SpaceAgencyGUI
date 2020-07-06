import { Coordinate } from './Coordinate';

export class FootprintDTO{
    constructor(
        public id: number,
        public coordinate1: Coordinate,
        public coordinate2: Coordinate,
        public coordinate3: Coordinate,
        public coordinate4: Coordinate,
    ){}
}