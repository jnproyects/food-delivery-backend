import { Router } from 'express';
import { AuthController } from './controller';
import { EmailService } from '../services';
import { envs } from '../../config';
import { AuthRepositoryImpl, MongoDbAuthDatasource } from '../../infrastructure';
import { AuthMiddleware } from '../middlewares/auth.middleware';



export class AuthRoutes {

  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_HOST, 
      envs.MAILER_USER, 
      envs.MAILER_PASS,
      envs.MAILER_PORT,
      envs.SEND_EMAIL,
    );

    const authDatasource = new MongoDbAuthDatasource( emailService );
    const authRepository = new AuthRepositoryImpl( authDatasource );

    const controller = new AuthController( authRepository );
    
    // registrar usuario
    router.post('/register', controller.registerUser );
    
    // validar sesion/auth del usuario
    router.get('/check-status', controller.checkAuth );

    // login de usuario
    router.post('/login', controller.loginUser );
    
    // valida email para cambio de contraseña 
    router.get('/password-recovery', controller.passwordRecovery );
    
    // valida código para cambio de contraseña
    router.get('/validate-code', controller.validateCode );

    // cambia el password del usuario
    router.put('/change-password', controller.changePassword );
    
    // validar correo electrónico
    router.get('/validate-email/:token', controller.validateEmail );

    return router;
  }

}

