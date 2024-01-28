import { CreateProductDto } from "../dtos/product/create-product.dto";
import { PaginationDto } from "../dtos/shared/pagination.dto";


export abstract class ProductsRepository {
    
    abstract createProduct( createProductDto: CreateProductDto ): Promise<Object>; // todo: crear entidad Product

    abstract getProducts( paginationDto: PaginationDto ): Promise<Object>;

}