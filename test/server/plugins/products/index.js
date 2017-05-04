const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Products = require('../../../server/plugins/products');
const BookshelfOrm = require('../../../server/plugins/bookshelf-orm');
const testHelpers = require('../../testHelpers');
const serverSetup = require('./_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing Products plugin', () => {

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


    it('should have exposed methods', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).not.to.exist();
                expect(server.plugins.Products.hasOwnProperty('getProductJsonFromRequest')).to.be.true();

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('should have models', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).not.to.exist();
                expect(server.plugins.BookshelfOrm.bookshelf.model('Product')).to.be.a.function();
                expect(server.plugins.BookshelfOrm.bookshelf.model('ProductArtist')).to.be.a.function();
                expect(server.plugins.BookshelfOrm.bookshelf.model('ProductCategory')).to.be.a.function();
                expect(server.plugins.BookshelfOrm.bookshelf.model('ProductGender')).to.be.a.function();
                expect(server.plugins.BookshelfOrm.bookshelf.model('ProductPic')).to.be.a.function();
                expect(server.plugins.BookshelfOrm.bookshelf.model('ProductSize')).to.be.a.function();
                expect(server.plugins.BookshelfOrm.bookshelf.model('ProductType')).to.be.a.function();

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    /*
     * ROUTE: GET /product/{id}
     */
     require('./routes/product-id');


     /*
      * ROUTE: GET /products
      */
      require('./routes/products');

});
