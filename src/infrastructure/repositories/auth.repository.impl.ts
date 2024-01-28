import { AuthDatasource, AuthRepository, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";



export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource: AuthDatasource
    ) {}
    
    
    register( registerUserDto: RegisterUserDto ): Promise<Object> {
        return this.authDatasource.register( registerUserDto );
    }
    
    checkAuth( token: string ): Promise<Object> {
        return this.authDatasource.checkAuth( token );
    }
    
    login( loginUserDto: LoginUserDto ): Promise<Object> {
        return this.authDatasource.login( loginUserDto );
    }
    
    passwordRecovery(email: string): Promise<Object> {
        return this.authDatasource.passwordRecovery( email );
    }

    validCodeGenerated( token: string, code: string ): Promise<boolean> {
        return this.authDatasource.validCodeGenerated( token, code );
    }

    changePassword( email: string, newPassword: string): Promise<boolean> {
        return this.authDatasource.changePassword( email, newPassword );
    }

    validateEmail( token: string ): Promise<boolean> {
        return this.authDatasource.validateEmail( token );
    }

}