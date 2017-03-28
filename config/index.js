require('dotenv').config();
const bunyan = require('bunyan');


module.exports = {
    development: {

        witToken: process.env.WIT_TOKEN,

        logger: () => {
            return bunyan.createLogger({
                name: 'box-devel',
                level: 'debug'
            })
        }
    }
};