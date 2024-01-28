import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
import { ProductRoutes } from './products/routes';
import { FileUploadRoutes } from './file-upload/routes';
import { ImageRoutes } from './images/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definición de las rutas
    router.use('/api/auth', AuthRoutes.routes ); // apuntar aca desde Flutter App

    router.use('/api/categories', CategoryRoutes.routes );
    router.use('/api/products', ProductRoutes.routes );
    router.use('/api/upload', FileUploadRoutes.routes );
    router.use('/api/images', ImageRoutes.routes );
    

    return router;
  }


}

