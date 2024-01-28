import mongoose from "mongoose";


interface MongoConnectionOptions {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {

    static async connect( options: MongoConnectionOptions ) {

        const { mongoUrl, dbName } = options;

        try {

            await mongoose.connect( mongoUrl, {
                dbName: dbName
            });

            console.log('mongo connected!');

            return true;
            
        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }

    }

    static async disconnect() {
        await mongoose.disconnect();
    }


}