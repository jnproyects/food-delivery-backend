import { Validators } from "../../../config";


export class CreateProductDto {

    private constructor(
        public readonly productName: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, // Id
        public readonly category: string, // Id
    ) {}

    static create( props: { [key:string]: any }): [ string?, CreateProductDto? ] {
        
        const { productName, available, price, description, user, category } = props;

        if ( !productName ) return ['Missing productName'];
        
        if ( !user ) return ['Missing user Id'];
        if ( !Validators.isMongoId( user ) ) return ['Invalid user Id'];
        
        if ( !category ) return ['Missing category Id'];
        if ( !Validators.isMongoId( category ) ) return ['Invalid category Id'];


        return [ undefined, new CreateProductDto( productName, !!available, price, description, user, category ) ];

    }

}