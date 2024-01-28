import { CategoryModel } from "../../../data";
import { CategoryDatasource, CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../../domain";


export class MongoDBCategoryDatasource implements CategoryDatasource {
    
    // DI
    constructor(){}
    
    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity): Promise<Object> {
        
        const categoryExists = await CategoryModel.findOne({ categoryName: createCategoryDto.categoryName });
        if ( categoryExists ) throw CustomError.badRequest( 'Category already exist' );

        try {
            
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await category.save();

            return {
                id: category.id,
                categoryName: category.categoryName,
                available: category.available
            }

        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
    }


    async getCategories(paginationDto: PaginationDto): Promise<Object> {
        
        const { page, limit } = paginationDto;

        try {

            // no es código bloqueante, se realiza de forma simultanea
            const [ totalCategories, categories ] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                .skip( ( page - 1 ) * limit )
                .limit( limit )
            ]);
            
            return {
                page: page,
                limit: limit,
                total: totalCategories,
                next: ( ( page * limit ) < totalCategories ) ? `/api/categories?page=${ (page + 1) }&limit=${ limit }` : null,
                prev: ( ( page - 1 ) > 0 ) ? `/api/categories?page=${ (page - 1) }&limit=${ limit }` : null,
                categories: categories.map( (category) => ({
                    id: category.id,
                    categoryName: category.categoryName,
                    available: category.available
                }))
            }
            
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }
    }

    


}