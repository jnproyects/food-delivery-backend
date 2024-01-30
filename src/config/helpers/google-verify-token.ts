import { OAuth2Client } from 'google-auth-library';
import { CustomError } from '../../domain';

const client = new OAuth2Client();
const CLIENT_ID = '980497599938-d1hhufq2rdki7bqlb0kgkg5b63j2be3n.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '980497599938-enc6k9kbmou1je7fg11k5vi1fciba12d.apps.googleusercontent.com';

export const validateGoogleIdToken =  async ( token: string ) => {
    
    try {
        
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID, // web client - type 3
                ANDROID_CLIENT_ID // Android client_id de app food delivery
            ],

        });

        const payload = ticket.getPayload();
        if ( !payload ) throw CustomError.internalServer('Error validating token'); 

        // if ( payload['aud'] === CLIENT_ID || payload['aud'] === ANDROID_CLIENT_ID )

        console.log('========PAYLOAD========');
        console.log( payload );

        return {
            name: payload['name'],
            picture: payload['picture'],
            email: payload['email'],
        }


    } catch (error) {
        throw CustomError.internalServer(`${ error }`);
    }


}