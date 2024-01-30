import { JwtAdapter, bcryptAdapter, envs, validateGoogleIdToken } from "../../../config";
import { generateRandomCode } from "../../../config/helpers/generate-random-code.helper";
import { UserModel } from "../../../data";
import { AuthDatasource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../../domain";
import { EmailService } from "../../../presentation/services";


export class MongoDbAuthDatasource implements AuthDatasource {
    
    constructor(
        private readonly emailService: EmailService,
    ) {}
    
    
    async register( registerUserDto: RegisterUserDto ): Promise<Object> {
        
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if ( existUser ) throw CustomError.badRequest('Email already exist');
        
        try {
            const user = new UserModel( registerUserDto );

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash( registerUserDto.password );

            await user.save();

            //TODO: Envia email para confirmación - descomentar cuando despleguemos backend server en la nube 
            await this.sendEmailValidationLink( user.email );

            const { password, ...userEntity } = UserEntity.fromObject( user );
            
            // Generar JWT
            const token = await JwtAdapter.generateToken({ id: user.id });
            if ( !token ) throw CustomError.internalServer('Error while creating JWT');
            
            return { 
                user: userEntity,
                token: token
            };


        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    async checkAuth( token: string): Promise<Object> {

        const payload = await JwtAdapter.validateToken<{ id: string }>( token );
        if( !payload ) throw CustomError.unauthorized('Invalid token');
        
        const { id } = payload;
        if ( !id ) throw CustomError.internalServer('Id not in token');
        
        const user = await UserModel.findById( payload.id );
        if ( !user ) throw CustomError.internalServer('User not exist');

        const { password, ...userEntity } = UserEntity.fromObject( user );
        
        // Genera token nuevo
        const newToken = await JwtAdapter.generateToken({ id: user.id });
        if ( !newToken ) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: userEntity,
            token: newToken
        }

    }
    
    async login( loginUserDto: LoginUserDto ): Promise<Object> {
        
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if ( !user ) throw CustomError.badRequest('Invalid credentials');

        let isMatch = bcryptAdapter.compare( loginUserDto.password, user.password );
        if ( !(isMatch === true) ) throw CustomError.badRequest('Invalid credentials');

        try {

            const { password, ...userEntity } = UserEntity.fromObject( user );
            
            // Generamos un nuevo JWT para el usuario logueado
            const token = await JwtAdapter.generateToken({ id: user.id });
            if ( !token ) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token
            }

        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }


    async passwordRecovery( email: string ): Promise<Object> {

        const user = await UserModel.findOne({ email: email });
        if ( !user ) throw CustomError.badRequest('Email not exists');

        try {

            const validationCode = generateRandomCode(4);
            
            const token = await JwtAdapter.generateToken({ validationCode }, '1m' );
            if ( !token ) throw CustomError.internalServer('Error while creating JWT');
            
            await this.sendValidationCode( user.email, validationCode );
            
            return {
                resp: true,
                token
            }
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
        
    }
    
    private sendValidationCode = async ( email: string, validationCode: string  ) => {
            
        const htmlBody = `
            <h1>Tu código de verificación es: ${ validationCode }</h1>
            <p>Ingresa este código en la pantalla donde se te está solicitando y continua el proceso de recuperación de tu contraseña.</p>
        `;

        const options = {
            to: email,
            subject: 'Código para recuperar tu contraseña',
            htmlBody: htmlBody
        }

        const isSent = await this.emailService.sendEmail( options );
        if ( !isSent ) throw CustomError.internalServer('Error sending email');
        
        return true;

    }


    async validCodeGenerated( token: string, codeUser: string ): Promise<boolean> {
        
        // recibimos el token y el código que viene desde UI y los verificamos
        const payload = await JwtAdapter.validateToken<{ validationCode: string }>( token );
        if( !payload ) throw CustomError.unauthorized('Invalid token');
        
        // tratamos de extraer el code del payload
        const { validationCode } = payload;
        if ( !validationCode ) throw CustomError.internalServer('validationCode not in token');

        // comparar los dos codes
        if ( codeUser != validationCode ) return false;

        return true;
    }


    async changePassword( email: string, newPassword: string ): Promise<boolean> {
        
        // Encriptar la contraseña
        const newPassCrypt = bcryptAdapter.hash( newPassword );

		// debemos considerar usar save() en lugar findOneAndUpdate()
        const updatedUser = await UserModel.findOneAndUpdate( { email: email }, { password: newPassCrypt }, { new: true } );
        if ( !updatedUser ) throw CustomError.badRequest('Invalid credentials');
        
        return true;

    }

    private sendEmailValidationLink = async ( email: string ) => {

        const token = await JwtAdapter.generateToken({ email });
        if ( !token ) throw CustomError.internalServer('Error getting token');

        const validationEmailLink = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;

        const htmlBody = `
            <h1>Validate your email</h1>
            <p>Please, click on the bellow link to validate your email</p>
            <a href="${ validationEmailLink }">Validate your email: ${ email }</a>
        `;

        const options = {
            to: email,
            subject: 'Validate Email',
            htmlBody: htmlBody
        }

        const isSent = await this.emailService.sendEmail( options );
        if( !isSent ) throw CustomError.internalServer('Error sending email');

        return true;

    }

    async validateEmail(token: string): Promise<boolean> {

        const payload = await JwtAdapter.validateToken( token );
        if( !payload ) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email not exist');

        user.emailValidated = true;
        await user.save();

        return true;

    }

    async loginWithGoogle( token: string ): Promise<Object> {
        
        const googleUser = await validateGoogleIdToken( token );
        if ( !googleUser ) throw CustomError.unauthorized('Error validating with google');
        // console.log( { googleUser: googleUser } );

        const user = await UserModel.findOne({ email: googleUser.email });

        if ( !user ) {

            // si no existe un user con ese email registramos al user en DB
            try {

                const user = new UserModel({ 
                    name: googleUser.name, 
                    email: googleUser.email, 
                    emailValidated: true,
                    img: googleUser.picture,
                });
    
                // Encriptar la contraseña
                // googleUser['aud'] ??? //todo
                user.password = bcryptAdapter.hash( 'Testing123456' );
    
                await user.save();
    
                const { password, ...userEntity } = UserEntity.fromObject( user );
                
                // Generar JWT
                const token = await JwtAdapter.generateToken({ id: user.id });
                if ( !token ) throw CustomError.internalServer('Error while creating JWT');
                
                return { 
                    user: userEntity,
                    token: token
                };
    
    
            } catch (error) {
                throw CustomError.internalServer(`${ error }`);
            }
        }
        
        
        // si existe un user en DB solo hacemos login normalmente
        //googleUser['aud']
        let isMatch = bcryptAdapter.compare( 'Testing123456', user.password );
        if ( !(isMatch === true) ) throw CustomError.badRequest('Invalid credentials');

        try {

            const { password, ...userEntity } = UserEntity.fromObject( user );
            
            // Generamos un nuevo JWT para el usuario logueado
            const token = await JwtAdapter.generateToken({ id: user.id });
            if ( !token ) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token
            }

        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

}