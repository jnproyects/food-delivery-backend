import mongoose from "mongoose";


export class Validators {

    static isMongoId( id: string ){
        return mongoose.isValidObjectId( id );
    }
}