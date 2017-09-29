const winston = require('winston');
const moment = require('moment');
// const appInsights = require('applicationinsights');


exports.register = (server, options, next) => {
     
    // Azure application insights setup:
    // let key = process.env.NODE_ENV === 'test' ? 'fakekey' : process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

    // if(process.env.NODE_ENV === 'test') {
    //     appInsights.setup('fakekey').start();
    // }
    // else {
    //     appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    //         .setAutoDependencyCorrelation(true)
    //         .setAutoCollectRequests(true)
    //         .setAutoCollectPerformance(true)
    //         .setAutoCollectExceptions(true)
    //         .setAutoCollectDependencies(true)
    //         .start();
    // }

    // global.appInsightsClient = appInsights.defaultClient;

    
    // Winston setup: 
    const logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: 'error',
                prettyPrint: true,
                colorize: true,
                silent: false,
                timestamp: () => moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
            })
        ],
        exceptionHandlers: [
            new winston.transports.Console({
                handleExceptions: true,
                humanReadableUnhandledException: true
            })
        ],
        exitOnError: false
    });

    logger.setLevels({
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    });

    // inject global function
    global.logger = logger

    return next();
};

exports.register.attributes = require('./package.json');
