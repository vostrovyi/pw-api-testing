const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
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
    config.userEmail = '',
        config.userPassword = ''
}

export { config }
