import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";


export class FileUploadService {

    constructor(
        private readonly uuid = Uuid.v4,
    ) {}

    private checkFolder( folderPath: string ) {
        if ( !fs.existsSync( folderPath ) ) {
            fs.mkdirSync( folderPath );
        }
    }
    
    // upload a file
    async uploadSingle(
        file: UploadedFile, 
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';
            
            if ( !validExtensions.includes( fileExtension ) ){
                throw CustomError.badRequest(`Invalid file extension: ${ fileExtension }, valid ones ${ validExtensions }`);
            }
            
            // acá podriamos llamar un API para enviar y almacenar el archivo en un servicio en la nube (cloudinary, bucket...)
            

            // proceso para guardar los archivos en el directorio de nuestro server-backend
            const destination = path.resolve( __dirname, '../../../', folder ); 
            this.checkFolder( destination );
            
            const fileName = `${ this.uuid() }.${ fileExtension }`;

            file.mv( `${ destination }/${ fileName }` );
            
            return { fileName };

        } catch (error) {
            console.log({error});
            throw error;
        }

    }


    // upload multiple files
    async uploadMultiple(
        files: UploadedFile[], 
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        // permite enviar un arreglo de promesas, ejecutandolas de manera simultanea y esperando a que todas se resuelvan
        const fileNames = await Promise.all(
            files.map( (file) => this.uploadSingle( file, folder, validExtensions ) )
        );

        return fileNames;

    }


}