import { CreateProductDto, PaginationDto, ProductsDatasource, ProductsRepository } from "../../domain";

export class ProductsRepositoryImpl implements ProductsRepository {
    
    constructor(
        private readonly productsDatasource: ProductsDatasource,
    ){}
    
    createProduct(createProductDto: CreateProductDto): Promise<Object> {
        return this.productsDatasource.createProduct( createProductDto );
    }
    getProducts(paginationDto: PaginationDto): Promise<Object> {
        return this.productsDatasource.getProducts( paginationDto );
    }

}