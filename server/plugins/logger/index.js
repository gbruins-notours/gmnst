const winston = require('winston');
const RotateFile = require('winston-daily-rotate-file');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const logsDirectory = path.join(__dirname, '../../../dist', 'logs');

exports.register = (server, options, next) => {
     
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory);
    }

    // Winston setup: 
    winston.setLevels({
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    });

    winston.addColors({
        debug: 'blue',
        info: 'cyan',
        warn: 'yellow',
        error: 'red'
    });

    const logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: 'error',
                prettyPrint: true,
                colorize: true,
                silent: false,
                timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
            }),
            new (RotateFile)({
                level: 'error',
                prettyPrint: true,
                silent: false,
                colorize: false,
                filename: path.join(logsDirectory, '/error.log'),
                timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                json: true,
                maxFiles: 10,
                datePattern: '.yyyy-MM-dd'
            })
        ],
        exceptionHandlers: [
            new winston.transports.Console({
                handleExceptions: true,
                humanReadableUnhandledException: true
            }),
            new (RotateFile)({
                prettyPrint: true,
                silent: false,
                colorize: false,
                filename: path.join(logsDirectory, '/error.log'),
                timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                json: true,
                maxFiles: 10,
                datePattern: '.yyyy-MM-dd'
            })
        ],
        exitOnError: false
    });

    // inject global function
    global.logger = logger

    return next();
};

exports.register.attributes = require('./package.json');
