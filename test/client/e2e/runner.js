'use strict';

require('dotenv').config();

const Hoek = require('hoek');
const Path = require('path');
const Server = require('../../../server');
const manifest = require('../../../server/manifest');

let srvr;

// 1. start the dev server using production config
process.env.NODE_ENV = 'test'

Server.init(manifest, {relativeTo: Path.resolve(__dirname, '../../../server')}, (err, server) => {
    srvr = server;

    if(err) {
        console.log('ERROR STARTING SERVER', err);
    }
    Hoek.assert(!err, err);

    const api = server.select('api');
    console.log('API server started at: ' + api.info.uri);

    // 2. run the nightwatch test suite against it
    // to run in additional browsers:
    //    1. add an entry in test/client/e2e/nightwatch.conf.json under "test_settings"
    //    2. add it to the --env flag below
    // or override the environment flag, for example: `npm run e2e -- --env chrome,firefox`
    // For more information on Nightwatch's config file, see
    // http://nightwatchjs.org/guide#settings-file
    let opts = process.argv.slice(2);

    if(opts.indexOf('--config') === -1) {
        opts = opts.concat(['--config', 'test/client/e2e/nightwatch.conf.js'])
    }

    if(opts.indexOf('--env') === -1) {
        opts = opts.concat(['--env', 'chrome'])
    }

    let spawn = require('cross-spawn')
    let runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })

    runner.on('exit', function (code) {
        srvr.stop();
        process.exit(code)
    })

    runner.on('error', function (err) {
        srvr.stop();
        throw err
    });
});