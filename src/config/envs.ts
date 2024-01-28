import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),

  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILER_HOST: get('MAILER_HOST').required().asString(),
  MAILER_USER: get('MAILER_USER').required().asString(),
  MAILER_PASS: get('MAILER_PASS').required().asString(),
  MAILER_PORT: get('MAILER_PORT').required().asPortNumber(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),


}



