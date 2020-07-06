import { Mission } from './Mission';
import { FootprintDTO } from './FootprintDTO';
import { Product } from './Product';


export class ProductDTO{
    constructor(
        public mission: Mission,
        public acquisitionDate: Date,
        public footprint: FootprintDTO,
        public price: number,
        public file: File
    ){}

   //ublic convertToProduct(){
   //   const product: Product = new Product()
   //   this.mission
   //
}