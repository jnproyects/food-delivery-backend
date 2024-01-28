import { ProductModel } from "../../../data";
import { CreateProductDto, CustomError, PaginationDto, ProductsDatasource } from "../../../domain";


export class MongoDbProductsDatasource implements ProductsDatasource {
    
    // DI
    constructor(){}
    
    async createProduct(createProductDto: CreateProductDto): Promise<Object> {
        const productExists = await ProductModel.findOne({ productName: createProductDto.productName });
        if ( productExists ) throw CustomError.badRequest( 'Product already exist' );

        try {
                
                const product = new ProductModel( createProductDto );

                await product.save();

                return product;

        } catch (error) {
                throw CustomError.internalServer(`${ error }`);
        }
    }

    async getProducts(paginationDto: PaginationDto): Promise<Object> {
        const { page, limit } = paginationDto;

        try {

                // no es código bloqueante, se realiza de forma simultanea
                const [ totalProducts, products ] = await Promise.all([
                        ProductModel.countDocuments(),
                        ProductModel.find()
                                .skip( ( page - 1 ) * limit )
                                .limit( limit )
                                .populate( 'user' )
                                .populate( 'category' )
                ]);
                
                return {
                        page: page,
                        limit: limit,
                        total: totalProducts,
                        next: ( ( page * limit ) < totalProducts ) ? `/api/products?page=${ (page + 1) }&limit=${ limit }` : null,
                        prev: ( ( page - 1 ) > 0 ) ? `/api/products?page=${ (page - 1) }&limit=${ limit }` : null,
                        products: products,
                }
                
        } catch (error) {
                throw CustomError.internalServer('Internal Server Error');
        }
    }



}