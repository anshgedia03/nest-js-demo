import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productservice;
    constructor(productservice: ProductService);
    getAllProducts(): {
        id: number;
        name: string;
        price: number;
    }[];
    getProductById(id: number): {
        id: number;
        name: string;
        price: number;
    } | undefined;
}
