'use strict';

const Lab = require('lab');
const Code = require('code');
const util = require('util');
const LabbableServer = require('../../server.js');
const testHelpers = require('../../test/testHelpers');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

let server;

describe('app-shopping-cart module: route handlers', () => {

    lab.before((done) => {

        // Callback fires once the server is initialized
        // or immediately if the server is already initialized
        LabbableServer.ready((err, srv) => {
            if (err) {
                return done(err);
            }

            server = srv;

            return done();
        });
    });

    // server is now available to be tested
    // it('initializes.', (done) => {
    //     expect(server).to.exist();
    //
    //     // isInitialized() can be used to check the server's init state
    //     expect(LabbableServer.isInitialized()).to.equal(true);
    //     done();
    // });


    describe('ROUTE: /cart/get', () => {
        it('returns a ShoppingCart JSON object', (done) => {
            let options = {
                method: 'GET',
                url: '/api/v1/cart/get'
            };

            server.inject(options, (response) => {
                expect(response.statusCode).to.equal(200);
                expect(testHelpers.isShoppingCartJson(response.result.data)).to.be.true();
                done();
            });
        });
    });


    describe('ROUTE: /cart/foo', () => {
        it('returns a 404 error', (done) => {
            let options = {
                method: 'GET',
                url: '/api/v1/cart/foo'
            };

            server.inject(options, (response) => {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });


    describe('Route: /cart/item/add', () => {
        var crumb;
        var payload = {
            product: {
                __selectedOptions: {
                    size: 3
                },
                id: 1
            },
            qty: 1
        };


        // function getCrumbFromResponse(response) {
        //     var cookie;
        //     var arr;
        //     var keyVal;
        //     var crumb;
        //
        //     if(util.isObject(response.raw.res._headers)
        //         && response.raw.res._headers.hasOwnProperty('set-cookie')
        //         && util.isArray(response.raw.res._headers['set-cookie'])) {
        //
        //         cookie = response.raw.res._headers['set-cookie'][0];
        //         arr = cookie.split(';');
        //
        //         for(var i=0; i<arr.length; i++) {
        //             keyVal = arr[i].split('=');
        //             if(util.isArray(keyVal) && keyVal[0] === 'crumb') {
        //                 crumb = keyVal[1];
        //             }
        //         }
        //     }
        //
        //     return crumb;
        // }

        // lab.before((done) => {
        //     let options = {
        //         method: 'POST',
        //         url: '/api/v1/cart/item/add',
        //         payload: payload
        //     };
        //
        //     server.inject(options, (response) => {
        //         // console.log("CRUMB RESPONSE", response.raw.res._headers['set-cookie'][0]);
        //         // console.log("CRUMB RESPONSE", getCrumbFromResponse(response));
        //         crumb = getCrumbFromResponse(response);
        //         done();
        //     });
        // });

        describe('POST /cart/item/add', () => {
            it('returns a ShoppingCart JSON object', (done) => {
                let options = {
                    method: 'POST',
                    url: '/api/v1/cart/item/add',
                    // headers: {'x-csrf-token': crumb},
                    payload: payload
                };

                server.inject(options, (response) => {
                    expect(response.statusCode).to.equal(200);
                    expect(testHelpers.isShoppingCartJson(response.result.data)).to.be.true();
                    done();
                });
            });

            it('returns 400 error (Bad Request) if invalid payload (missing product id)', (done) => {
                let options = {
                    method: 'POST',
                    url: '/api/v1/cart/item/add',
                    payload: {
                        product: {
                            __selectedOptions: {
                                size: 3
                            }
                            // id: 1  // removing a required param
                        },
                        qty: 1
                    }
                };

                server.inject(options, (response) => {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });

            it('returns 400 error (Bad Request) if invalid payload (missing qty)', (done) => {
                let options = {
                    method: 'POST',
                    url: '/api/v1/cart/item/add',
                    payload: {
                        product: {
                            __selectedOptions: {
                                size: 3
                            },
                            id: 1
                        }
                        // qty: 1
                    }
                };

                server.inject(options, (response) => {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });

            it('returns 400 error (Bad Request) if invalid payload (size is not a number)', (done) => {
                let options = {
                    method: 'POST',
                    url: '/api/v1/cart/item/add',
                    payload: {
                        product: {
                            __selectedOptions: {
                                size: 'abc'  // <=========
                            },
                            id: 1
                        },
                        qty: 1
                    }
                };

                server.inject(options, (response) => {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
            });
        });
    });



    describe('DELETE /cart/item/remove/{id}', () => {
        var shoppingCart;
        var itemId;

        lab.before((done) => {
            let options = {
                method: 'POST',
                url: '/api/v1/cart/item/add',
                payload: {
                    product: {
                        __selectedOptions: {
                            size: 3
                        },
                        id: 1
                    },
                    qty: 1
                }
            };

            server.inject(options, (response) => {
                shoppingCart = response.result.data;
                // console.log("SHOPPING CART", shoppingCart);

                expect(testHelpers.isShoppingCartJson(shoppingCart)).to.be.true();
                expect(shoppingCart.cart_data[0].itemId).to.exist();

                itemId = shoppingCart.cart_data[0].itemId;
                done();
            });
        });

        // TODO:
        // Because I am not sending the session cookie in the request
        // a new shopping cart is created every time
        // via ShoppingCartService.findOrCreateSessionCart()
        // so the ID I am passing never exists.
        // Need to figure out a solution.
        /*
        it('returns a ShoppingCart JSON object', (done) => {
            let options = {
                method: 'DELETE',
                url: '/api/v1/cart/item/remove/' + itemId
            };

            console.log("OPTS", options);

            server.inject(options, (response) => {
                expect(response.statusCode).to.equal(200);
                expect(testHelpers.isShoppingCartJson(response.result.data)).to.be.true();
                done();
            });
        });
        */

        it('returns 400 error (Bad Request) if an invalid itemId is sent', (done) => {
            let options = {
                method: 'DELETE',
                url: '/api/v1/cart/item/remove/1'
            };

            server.inject(options, (response) => {
                expect(response.statusCode).to.equal(400);
                done();
            });
        });

        it('returns 400 error (Bad Request) if an itemId is not a number', (done) => {
            let options = {
                method: 'DELETE',
                url: '/api/v1/cart/item/remove/abc'
            };

            server.inject(options, (response) => {
                expect(response.statusCode).to.equal(400);
                done();
            });
        });
    });
});