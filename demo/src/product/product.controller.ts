import { Controller ,Get, Param} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productservice:ProductService){}

    @Get()
    getAllProducts(){
        return this.productservice.getAllProducts();

    }
    @Get(':id')
    getProductById(@Param('id') id: number){
        return this.productservice.getProductById(Number(id));
    }

}
