const winston = require ('winston');

const logger = winston.createLogger({
    level:'info',
    transports:[
        new winston.transports.Console({level: "info"}),
        // new winston.transports.Console({level:'warn'}),
        // new winston.transports.Console({level:'error'}),
        new winston.transports.File({ filename: 'warning.log', level:'warn'}),
        new winston.transports.File({ filename: 'error.log', level:'error'})
    ]
})

module.exports = logger