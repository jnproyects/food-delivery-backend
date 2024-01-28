import { createInterface } from "readline";
import { envs } from "../../config";
import { MongoDatabase, CategoryModel, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";



const confirmationQuestion = (text: string) => {

    return new Promise((resolve) => {
  
      // conectar readline con la consola
      const ifc = createInterface({
        input: process.stdin,
        output: process.stdout,
      });
  
      ifc.question(text, (res) => {
        ifc.close();
        resolve(res.toLowerCase() === 'yes' || res.toLowerCase() === 'y');
      });
  
    });
  
};


(async() => {

    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    const confirmation = await confirmationQuestion(
        'Are you sure do you want to wipe and repopulate the database? (yes/no): '
    );
    
    if (!confirmation) {

    process.exit();

    }

    await main();

    await MongoDatabase.disconnect();

})();

  
const randomBetween0andX = ( x: number ) => {
    return Math.floor( Math.random() * x );
}

async function main(){

    // 0. Delete all data
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);

    // 1. Create users
    const users = await UserModel.insertMany( seedData.users );

    // 2. Create categories
    const categories = await CategoryModel.insertMany(
        seedData.categories.map( (category) => {
            return {
                ...category,
                user: users[0]._id
            }
        })
    );

    // 3. Create products
    const products = await ProductModel.insertMany(
        seedData.products.map( (product) => {
            return {
                ...product,
                user: users[ randomBetween0andX( seedData.users.length - 1 ) ]._id,
                category: categories[ randomBetween0andX( seedData.categories.length - 1 ) ]._id,
            }
        })
    )

    console.log('DB succesfully populated with SEED!');

}