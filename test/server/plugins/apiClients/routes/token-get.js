const Lab = require('lab');
const Code = require('code');
const jwt = require('jsonwebtoken');
const testHelpers = require('../../../testHelpers');
const serverSetup = require('../_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing route: POST /token/get', () => {

    // Saving this example of how to acquire/add x-csrf-token headers
    // in case the Crumb plugin is re-enabled
    /*
    it('should get a token when sent a valid clientId and clientSecret', (done) => {
        Server.init(serverSetup.manifest, serverSetup.composeOptions, (err, server) => {
            expect(err).to.not.exist();

            testHelpers.getInfo(server, ({crumb}) => {
                const request = {
                    method: 'POST',
                    url: '/some/url',
                    payload: {
                        some: 'foo1',
                        attributes: 'foo2'
                    },
                    headers: {
                        'x-csrf-token': crumb,
                        cookie: 'crumb=' + crumb
                    }
                };

                server.inject(request, (res) => {
                    // ...
                });
            });
        });
    });
    */


    it('should get a token', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                console.log("NODE_ENV ====================", process.env.NODE_ENV)
                expect(err).not.to.exist();

                server.inject({
                    method: 'POST',
                    url: '/token/get',
                    headers
                })
                .then((res) => {
                    expect(res.statusCode, 'Status code').to.equal(200);
                    expect(res.headers.hasOwnProperty('x-authorization')).to.equal(true);

                    let decoded = jwt.decode(res.headers['x-authorization']);
                    expect(decoded.clientId).to.equal(process.env.JWT_CLIENT_ID);
                    expect(decoded.hasOwnProperty('jti')).to.equal(true);

                    testHelpers.destroyKnexAndStopServer(server, done);
                })
            });
    });

});
