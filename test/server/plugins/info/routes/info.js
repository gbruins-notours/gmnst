const Lab = require('lab');
const Code = require('code');
const Hoek = require('hoek');
const testHelpers = require('../../../testHelpers');
const serverSetup = require('../_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing route: GET /info', () => {

    it('returns application info', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).not.to.exist();

                testHelpers.getJwtHeaders(server, (headers) => {
                    const request = {
                        method: 'GET',
                        url: '/info',
                        headers
                    };

                    server.inject(request, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(200);
                        expect(res.result, 'result').to.be.an.object();
                        expect(res.result.data).to.be.an.object();
                        expect(res.result.data.clientToken, 'Client Token').to.be.a.string();
                        expect(res.result.data.product).to.be.an.object();
                        expect(res.result.data.product.category, 'Category').to.be.an.object();
                        expect(res.result.data.product.gender, 'Gender').to.be.an.object();
                        expect(res.result.data.product.size, 'Size').to.be.an.object();
                        expect(res.result.data.product.type, 'Type').to.be.an.object();

                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
            });
    });


    it('returns 401 error when client token can not be obtained', (done) => {
        // Changing the publicKey option for the 'payments' plugin so we can generate a failure
        let manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations[7].plugin.options.publicKey = 'foo';

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

                const request = {
                    method: 'GET',
                    url: '/info',
                    headers
                };

                server.inject(request, (res) => {
                    expect(res.statusCode, 'Status code').to.equal(401);
                    testHelpers.destroyKnexAndStopServer(server, done);
                });
            });
    });

});
