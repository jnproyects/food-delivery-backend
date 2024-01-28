

export class CreateCategoryDto {

    
    private constructor(
        public readonly categoryName: string,
        public readonly available: boolean,
    ) {}

    // valida el body que viene en la petición/req.body y lo convierte en un objeto CreateCategoryDto 
    static create( object: { [key: string]: any } ): [ string?, CreateCategoryDto? ] {

        const { categoryName, available = false } = object;
        let availableBoolean = available;
        
        if ( !categoryName ) return ['Missing categoryName'];

        if ( typeof available !== 'boolean' ) {
            availableBoolean = ( available === 'true' );
        }

        return [ undefined, new CreateCategoryDto( categoryName, availableBoolean ) ];




    }


}