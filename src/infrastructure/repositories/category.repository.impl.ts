import { CreateCategoryDto, PaginationDto, CategoryRepository, CategoryDatasource, UserEntity } from "../../domain";

export class CategoryRepositoryImpl implements CategoryRepository {
    
    constructor(
        private readonly categoryDatasource: CategoryDatasource
    ) {}


    createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity): Promise<Object> {
        return this.categoryDatasource.createCategory( createCategoryDto, user );
    }
    
    getCategories(paginationDto: PaginationDto): Promise<Object> {
        return this.categoryDatasource.getCategories( paginationDto );
    }
    
}