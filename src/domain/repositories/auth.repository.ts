import { LoginUserDto, RegisterUserDto } from "../dtos/auth";

export abstract class AuthRepository {

    abstract register( registerUserDto: RegisterUserDto ): Promise<Object>;
    
    abstract login( loginUserDto: LoginUserDto ): Promise<Object>;

    abstract checkAuth( token: string ): Promise<Object>;

    abstract passwordRecovery( email: string ): Promise<Object>;

    abstract validCodeGenerated( token: string, code: string ): Promise<boolean>;
    
    abstract changePassword( email: string, newPassword: string ): Promise<boolean>;

    abstract validateEmail( token: string ): Promise<boolean>;
    
    abstract loginWithGoogle( token: string ): Promise<Object>;


}