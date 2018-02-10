const winston = require('winston');
const RotateFile = require('winston-daily-rotate-file');
const moment = require('moment');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const bugsnag = require('bugsnag')

let logsDirectory = null;

exports.register = (server, options, next) => {

    // Bugsnag setup:
    bugsnag.register(process.env.BUG_SNAG_API_KEY);
    global.bugsnag = function() {
        let args = arguments;

        return new Promise((resolve, reject) => {
            if(process.env.NODE_ENV === 'production') {
                bugsnag.notify(args);
            }
            resolve();
        });
    };
    
     
    if(process.env.NODE_ENV === 'production') {
        logsDirectory = path.join(__dirname, '../../../dist', 'logs');

        if (!fs.existsSync(logsDirectory)) {
            fs.mkdirSync(logsDirectory);
        }
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

    
    let transports = [
        new (winston.transports.Console)({
            level: 'error',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
        })
    ];

    let exceptionHandlers = [
        new winston.transports.Console({
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ];

    // only printing to log files if there is one (production)
    if(logsDirectory) {
        transports.push(
            new (RotateFile)({
                level: 'error',
                prettyPrint: true,
                silent: false,
                colorize: false,
                filename: path.join(logsDirectory, '/error.log'),
                timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                json: false,
                maxFiles: 10,
                datePattern: '.yyyy-MM-dd'
            })
        );

        exceptionHandlers.push(
            new (RotateFile)({
                prettyPrint: true,
                silent: false,
                colorize: false,
                filename: path.join(logsDirectory, '/error.log'),
                timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                json: false,
                maxFiles: 10,
                datePattern: '.yyyy-MM-dd'
            })
        )
    }


    const logger = new (winston.Logger)({
        transports,
        exceptionHandlers,
        exitOnError: false
    });

    // inject global function
    global.logger = logger

    return next();
};

exports.register.attributes = require('./package.json');
