const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Products = require('../../../../server/plugins/products');
const Payments = require('../../../../server/plugins/payments');
const BookshelfOrm = require('../../../../server/plugins/bookshelf-orm');
const SalesTax = require('../../../../server/plugins/sales-tax');
const testHelpers = require('../../testHelpers');
const serverSetup = require('./_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing ShoppingCart plugin', () => {

    it('errors on missing BookshelfOrm plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        testHelpers.spliceRegistrationFromManifest('./plugins/bookshelf-orm', manifest);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).to.exist();
                expect(err.message).to.include(`missing dependency ${BookshelfOrm.register.attributes.name}`);

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('errors on missing Products plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        testHelpers.spliceRegistrationFromManifest('./plugins/products', manifest);

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
        testHelpers.spliceRegistrationFromManifest('./plugins/payments', manifest);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).to.exist();
                expect(err.message).to.include(`missing dependency ${Payments.register.attributes.name}`);

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('errors on missing SalesTax plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        testHelpers.spliceRegistrationFromManifest('./plugins/sales-tax', manifest);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).to.exist();
                expect(err.message).to.include(`missing dependency ${SalesTax.register.attributes.name}`);

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('should have exposed methods', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).not.to.exist();
                expect(server.plugins.ShoppingCart.hasOwnProperty('schema')).to.be.true();
                expect(server.plugins.ShoppingCart.hasOwnProperty('findOrCreate')).to.be.true();

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

    // describe('Testing exposed method: findOrCreate', () => {
    //     //TODO
    // });

});
