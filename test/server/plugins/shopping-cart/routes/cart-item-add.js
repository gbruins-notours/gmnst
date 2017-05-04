const Lab = require('lab');
const Code = require('code');
const testHelpers = require('../../../testHelpers');
const serverSetup = require('../_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing route: POST /cart/item/add', () => {
    it('should return a 200 response when sending the correct payload', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

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
                    expect(res.statusCode, 'Status code').to.equal(200);
                    testHelpers.destroyKnexAndStopServer(server, done);
                });
            });
    });


    it('a 200 response should contain a JSON representation of the Shopping Cart', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

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
                    let data = JSON.parse(JSON.stringify(res.result.data));

                    expect(res.statusCode, 'Status code').to.equal(200);
                    expect(data.hasOwnProperty('cart_data')).to.equal(true);
                    expect(data.cart_data[0].hasOwnProperty('itemId')).to.equal(true);
                    expect(data.cart_data[0].hasOwnProperty('product')).to.equal(true);

                    testHelpers.destroyKnexAndStopServer(server, done);
                });
            });
    });


    describe('should return a 400 error (Bad Request) when the payload is incorrect', () => {
        it('payload: product._selectedOptions.size is not a number', (done) => {
            testHelpers
                .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
                .then(({err, server, headers}) => {
                    expect(err).not.to.exist();

                    const request = {
                        method: 'POST',
                        url: '/cart/item/add',
                        headers,
                        payload: {
                            product: {
                                __selectedOptions: {
                                    size: 'abc'  // <-----
                                },
                                id: 1
                            },
                            qty: 1
                        }
                    };

                    server.inject(request, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(400);
                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
        });


        it('payload: product._selectedOptions.size is null', (done) => {
            testHelpers
                .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
                .then(({err, server, headers}) => {
                    expect(err).not.to.exist();

                    const request = {
                        method: 'POST',
                        url: '/cart/item/add',
                        headers,
                        payload: {
                            product: {
                                __selectedOptions: {
                                    size: null  // <-----
                                },
                                id: 1
                            },
                            qty: 1
                        }
                    };

                    server.inject(request, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(400);
                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
        });


        it('payload: product.id is not a number', (done) => {
            testHelpers
                .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
                .then(({err, server, headers}) => {
                    expect(err).not.to.exist();

                    const request = {
                        method: 'POST',
                        url: '/cart/item/add',
                        headers,
                        payload: {
                            product: {
                                __selectedOptions: {
                                    size: 1
                                },
                                id: 'abc' // <-----
                            },
                            qty: 1
                        }
                    };

                    server.inject(request, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(400);
                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
        });


        it('payload: product is not included', (done) => {
            testHelpers
                .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
                .then(({err, server, headers}) => {
                    expect(err).not.to.exist();

                    const request = {
                        method: 'POST',
                        url: '/cart/item/add',
                        headers,
                        payload: {
                            qty: 1
                        }
                    };

                    server.inject(request, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(400);

                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
        });


        it('payload: qty is not a number', (done) => {
            let payload = {
                product: {
                    __selectedOptions: {
                        size: 1
                    },
                    id: 1
                },
                qty: 'abc' // <-----
            };

            testHelpers
                .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
                .then(({err, server, headers}) => {
                    expect(err).not.to.exist();

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
                            qty: 'abc' // <-----
                        }
                    };

                    server.inject(request, (res) => {
                        expect(res.statusCode, 'Status code').to.equal(400);
                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
                });
        });
    });

});
