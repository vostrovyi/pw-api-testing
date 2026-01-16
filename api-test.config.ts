import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });


const processENV = process.env.TEST_ENV
const env = processENV || 'prod'
console.log('Test Environment is: ' + env)


const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'no_krot@ukr.net',
    userPassword: 'Qwerty@123'
}

if (env === 'qa') {
    config.userEmail = 'no_krot2@ukr.net',  //overrides
        config.userPassword = 'Qwerty@123'
}
if (env === 'prod') {
    // if (!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
    //     throw Error('Missing requered environment variables')
    // }
    config.userEmail = process.env.PROD_USERNAME as string,
    config.userPassword = process.env.PROD_PASSWORD as string
}

export { config }
