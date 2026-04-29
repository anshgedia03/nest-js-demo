export declare class ProductService {
    private products;
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
