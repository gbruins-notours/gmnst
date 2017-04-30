const Server = require('../server');


function destroyKnexAndStopServer(server, done) {
    server.plugins.BookshelfOrm.knexObject.destroy(() => {
       server.stop(done);
    });
}


function getJwtHeaders(server, callback) {
    const request = {
        method: 'POST',
        url: '/token/get',
        payload: {
            clientId: process.env.JWT_CLIENT_ID,
            clientSecret: process.env.JWT_CLIENT_SECRET
        }
    };

    server.inject(request, (res) => {
        let headers = {
            'Authorization': `Bearer ${res.headers['x-authorization']}`
        };

        callback(headers);
    });
}


function getInfo(server, callback) {
    getJwtHeaders(server, (headers) => {
        const request = {
            method: 'GET',
            url: '/info',
            headers: headers
        };

        server.inject(request, (res) => {
            callback(res.result.data);
        });
    });
}


function getBasicManifest() {
    let manifest = {
        connections: [
            {
                port: 0
            }
        ],
        registrations: [
            {
                plugin: {
                    register: './plugins/yar',
                    options: {}
                }
            },
            // {
            //     plugin: {
            //         register: './plugins/crumbCsrf',
            //         options: {}
            //     }
            // },
            {
                plugin: {
                    register: 'inert'
                }
            },
            {
                plugin: {
                    register: './plugins/core'
                }
            },
            {
                plugin: {
                    register: './plugins/apiClients'
                }
            }
        ]
    };

    return manifest;
}


function startServerAndGetHeaders(manifest, composeOptions) {
    let p = new Promise((resolve, reject) => {

        Server.init(manifest, composeOptions, (err, server) => {
            if(err) {
                resolve({
                    err,
                    server
                });
                return;
            }

            getJwtHeaders(server, (headers) => {
                resolve({
                    err,
                    server,
                    headers
                });
            });
        });
    });

    return p;
}
        

module.exports.destroyKnexAndStopServer = destroyKnexAndStopServer;
module.exports.getInfo = getInfo;
module.exports.getJwtHeaders = getJwtHeaders;
module.exports.getBasicManifest = getBasicManifest;
module.exports.startServerAndGetHeaders = startServerAndGetHeaders;
