import { Customer } from './Customer';
import { Product } from './Product';

export class CustomerOrder{
    constructor(
        public id: number,
        public customer: Customer,
        public productList: Product[],
        public orderDate: Date,
    ){}
}