const Lab = require('lab');
const Code = require('code');
const Hoek = require('hoek');
const testHelpers = require('../../../testHelpers');
const serverSetup = require('../_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing route: DELETE /cart/item/remove/{id}', () => {
    it('return a 400 when a string is sent as the param', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

                const request = {
                    method: 'DELETE',
                    url: '/cart/item/remove/abc',
                    headers
                };

                server.inject(request, (res) => {
                    expect(res.statusCode, 'Status code').to.equal(400);
                    testHelpers.destroyKnexAndStopServer(server, done);
                });
            });
    });


    it('should return 200 when removing an item from the cart', (done) => {
        let manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations[0].plugin.options.customSessionIDGenerator = function(request) {
            return 'abcde';
        };

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

                // Add a new item to the cart
                // Get the 'itemId' of that new item from the response
                // Delete the item from the cart
                const request = {
                    method: 'POST',
                    url: '/cart/item/add',
                    headers,
                    payload: {
                        product: {
                            __selectedOptions: {
                                size: 1
                            },
                            id: 1
                        },
                        qty: 1
                    }
                };

                server.inject(request, (res) => {
                    const request2 = {
                        method: 'DELETE',
                        url: `/cart/item/remove/${ res.result.data.cart_data[0].itemId }`,
                        headers
                    };

                    server.inject(request2, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(200);
                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
            });
    });


    it('should return 422 (Bad data) when removing an item that does not exist', (done) => {
        let manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations[0].plugin.options.customSessionIDGenerator = function(request) {
            return 'abcde';
        };

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

                const request = {
                    method: 'DELETE',
                    url: `/cart/item/remove/12345`, // 12345 should not exist
                    headers
                };

                server.inject(request, (res) => {
                    expect(res.statusCode, 'Status code').to.equal(422);
                    testHelpers.destroyKnexAndStopServer(server, done);
                });
            });
    });

});
