import { Request, Response } from "express";
import { AuthRepository, CustomError, LoginUserDto, RegisterUserDto } from "../../domain";


export class AuthController {

    // DI
    constructor(
        public readonly authRepository: AuthRepository
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        console.log(`${ error }`);
		return res.status(500).json({ error: 'Internal server error' });

    }

    registerUser = ( req: Request, res: Response ) => {
        
        const [error, registerUserDto] = RegisterUserDto.create( req.body );
        if ( error ) return res.status( 400 ).json( { error } );

        this.authRepository.register( registerUserDto! )
            .then( ( user ) => res.json( user ))
            .catch( (error) => this.handleError( error, res ) );

    }

    checkAuth = ( req: Request, res: Response ) => {
        
        // extraer token del request
        const authorization = req.header('Authorization');
        if ( !authorization ) return res.status(401).json({ error: 'No token provided'});
        if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid Bearer token'});

        const token = authorization.split(' ').at(1) || '';

        this.authRepository.checkAuth( token )
            .then( ( user ) => res.json( user ) )
            .catch( (error) => this.handleError( error, res ) );

    }

    loginUser = ( req: Request, res: Response ) => {

        const [error, loginuserDto] = LoginUserDto.create( req.body );
        if ( error ) return res.status( 400 ).json( { error } );

        this.authRepository.login( loginuserDto! )
            .then( ( user ) => res.json( user )) // lo que recibimos en app Flutter
            .catch( (error) => this.handleError( error, res ) );
    }

    passwordRecovery = ( req: Request, res: Response ) => {
        const { email } = req.body;

        this.authRepository.passwordRecovery( email )
            .then( ( existsEmail ) => res.json( existsEmail ) )
            .catch( ( error ) => this.handleError( error, res ) );
    }

    validateCode = ( req: Request, res: Response ) => {
        const { token, code } = req.body;

        this.authRepository.validCodeGenerated( token, code )
            .then( ( validCode ) => res.json( validCode ) )
            .catch( (error) => this.handleError( error, res ) );
    }

    changePassword = ( req: Request, res: Response ) => {
        const { email, newPassword } = req.body;
        this.authRepository.changePassword( email, newPassword )
            .then( ( resp ) => res.json( resp ) )
            .catch( (error) => this.handleError( error, res ) );
    }

    validateEmail = ( req: Request, res: Response ) => {
        
        const { token } = req.params;

        this.authRepository.validateEmail( token )
            .then( () => res.json('Email successfully validated!') )
            .catch( (error) => this.handleError( error, res ) );
    }
}