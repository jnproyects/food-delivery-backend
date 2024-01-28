import { regularExps } from "../../../config";

// se utiliza en este caso para validar la Request que envia el cliente desde Flutter app
export class LoginUserDto {

    private constructor(
        public email: string,
        public password: string,
    ) {}


    static create( object: { [key:string]: any } ): [ string?, LoginUserDto? ]  {
        
        const { email, password } = object;

        if ( !email ) return [ 'Missing email', undefined ];
        if ( !regularExps.email.test( email ) ) return [ 'Email is not valid', undefined ];
       
        if ( !password ) return [ 'Missing password', undefined ];
        if ( password.length < 6 ) return [ 'Password too short', undefined ];

        return [ undefined, new LoginUserDto( email, password ) ];

    }


}