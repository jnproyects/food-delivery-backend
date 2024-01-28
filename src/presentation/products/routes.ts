import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';
import { MongoDbProductsDatasource, ProductsRepositoryImpl } from '../../infrastructure';

export class ProductRoutes {


  static get routes(): Router {
    
    const router = Router();

    const productsDatasource = new MongoDbProductsDatasource();
    const productsRepository = new ProductsRepositoryImpl( productsDatasource );
    
    const controller = new ProductController( productsRepository );

    // Definición de los endpoints
    router.get('/', controller.getProducts );
    router.post('/', [ AuthMiddleware.validateJWT ], controller.createProduct );
    
    return router;
  }


}

