import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { PaginationDto } from "../dtos/shared/pagination.dto";
import { UserEntity } from "../entities/user.entity";

export abstract class CategoryRepository {

    abstract createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ): Promise<Object>;

    abstract getCategories( paginationDto: PaginationDto ): Promise<Object>;

}