"use strict";

var path = require('path'),
    bunyan = require('bunyan'),

    infoLogger = bunyan.createLogger({
        name: 'emine',
        streams: [{
            type: 'rotating-file',
            path: path.join(__dirname, './logs/info-emine.log'),
            period: '1d',
            count: 10
        }]
    }),
    errorLogger = bunyan.createLogger({
        name: 'emine',
        streams: [{
            type: 'rotating-file',
            path: path.join(__dirname, './logs/error-emine.log'),
            period: '1d',
            count: 10
        }]
    });

module.exports.info = infoLogger.info.bind(infoLogger);
module.exports.error = errorLogger.error.bind(errorLogger);
