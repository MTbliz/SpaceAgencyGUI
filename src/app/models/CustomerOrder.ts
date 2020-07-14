import { Product } from './Product';
import { AppUser } from './AppUser';

export class CustomerOrder{
    constructor(
        public id: number,
        public customer: AppUser,
        public productList: Product[],
        public orderDate: Date,
    ){}
}