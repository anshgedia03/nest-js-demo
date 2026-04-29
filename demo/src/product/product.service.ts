import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    private products=[
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
    ]

    getAllProducts(){
        return this.products;
    }

    getProductById(id: number){
        return this.products.find(product => product.id === id);
    }
}
