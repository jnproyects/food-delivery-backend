import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryRepositoryImpl } from '../../infrastructure/repositories/category.repository.impl';
import { MongoDBCategoryDatasource } from '../../infrastructure';

export class CategoryRoutes {


  static get routes(): Router {
    
    const router = Router();
    
    const categoryDatasource = new MongoDBCategoryDatasource();
    const categoryRepository = new CategoryRepositoryImpl( categoryDatasource );

    const controller = new CategoryController( categoryRepository );

    router.get('/', controller.getCategories );
    router.post('/', [ AuthMiddleware.validateJWT ], controller.createCategory );

    return router;
  }


}

