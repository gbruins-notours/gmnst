const Lab = require('lab');
const Code = require('code');
const Hoek = require('hoek');
const testHelpers = require('../../../testHelpers');
const serverSetup = require('../_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing route: POST /cart/qty/update', () => {
    it('should return 200 when updating an item in the cart', (done) => {
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
                    let itemId = res.result.data.cart_data[0].itemId;
                    let data = {};
                    data[itemId] = 3;

                    const request2 = {
                        method: 'POST',
                        url: '/cart/qty/update',
                        headers,
                        payload: {
                            data: data
                        }
                    };

                    server.inject(request2, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(200);

                        res.result.data.cart_data.forEach((obj) => {
                            if(obj.itemId === itemId) {
                                // The returned data should have the updated
                                // 'qty' value
                                expect(obj.product.qty).to.equal(data[itemId]);
                            }
                        });

                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
            });
    });


    it('should return 422 (Bad data) when updating an item that does not exist', (done) => {
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
                    let data = {};
                    data[12345] = 3;  // 12345 does not exist

                    const request2 = {
                        method: 'POST',
                        url: '/cart/qty/update',
                        headers,
                        payload: {
                            data: data
                        }
                    };

                    server.inject(request2, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(422);
                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
            });
    });

});
