import path from "path";
import fs from "fs";
import { Request, Response } from "express";


export class ImageController {

    constructor() {}

    getImage = ( req: Request, res: Response ) => {

        const { type = '', img = '' } = req.params;

        const imagePath = path.resolve( __dirname, `../../../uploads/${ type }/${ img }` );
        // console.log( imagePath );

        if ( !fs.existsSync( imagePath ) ) {
            return res.status(404).send('Image not found');
        }        
        
        // ruta que devolvemos y se consume en el front-end
        res.sendFile( imagePath );

    }


}