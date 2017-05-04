const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Products = require('../../../server/plugins/products');
const Payments = require('../../../server/plugins/payments');
const ShoppingCart = require('../../../server/plugins/shopping-cart');
const BookshelfOrm = require('../../../server/plugins/bookshelf-orm');
const testHelpers = require('../../testHelpers');
const serverSetup = require('./_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing ShoppingCart plugin', () => {

    it('errors on missing yar plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations.splice(0, 1);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).to.exist();
                expect(err.message).to.include('missing dependency yar');

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('errors on missing BookshelfOrm plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations.splice(2, 1);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).to.exist();
                expect(err.message).to.include(`missing dependency ${BookshelfOrm.register.attributes.name}`);

                server.stop(done);
            });
    });


    it('errors on missing Products plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations.splice(5, 1);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).to.exist();
                expect(err.message).to.include(`missing dependency ${Products.register.attributes.name}`);

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('errors on missing Payments plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations.splice(6, 1);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).to.exist();
                expect(err.message).to.include(`missing dependency ${Payments.register.attributes.name}`);

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('should have exposed methods', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).not.to.exist();
                expect(server.plugins.ShoppingCart.hasOwnProperty('schema')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('findOrCreateSessionCart')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('getCartItemPrice')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('getCartItemTotalPrice')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('getNumItemsInCart')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('getCartSalesTax')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('getCartSubTotal')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('getCartGrandTotal')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('STATUS_PAYMENT_SUCCESS')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('STATUS_PAYMENT_FAILED')).to.be.true();

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('should have a ShoppingCart model', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).not.to.exist();
                expect(server.plugins.BookshelfOrm.bookshelf.model('ShoppingCart')).to.be.a.function();

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    /*
     * ROUTE: GET /cart/get
     */
     require('./routes/cart-get');

    /*
     * ROUTE: POST /cart/item/add
     */
     require('./routes/cart-item-add');

    /*
     * ROUTE: DELETE /cart/item/remove
     */
     require('./routes/cart-item-remove');

    /*
     * ROUTE: POST /cart/qty/update
     */
     require('./routes/cart-qty-update');

    /*
     * ROUTE: POST /cart/checkout
     */
     require('./routes/cart-checkout');

     /*
      * ROUTE: GET /cart/{param*}
      */
     require('./routes/cart-param');


    // describe('Testing exposed method: findOrCreateSessionCart', () => {
    //     //TODO
    // });

});
