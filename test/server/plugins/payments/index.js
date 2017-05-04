const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Payments = require('../../../server/plugins/payments');
const BookshelfOrm = require('../../../server/plugins/bookshelf-orm');
const testHelpers = require('../../testHelpers');
const serverSetup = require('./_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing Payments plugin', () => {

    it('errors on missing BookshelfOrm plugin', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations.splice(2, 1);

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).to.exist();
                expect(err.message).to.include(`missing dependency ${BookshelfOrm.register.attributes.name}`);

                // server.stop(done);
                done();
            });
    });


    it('should fail to load with a bad merchantId option', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations[5].plugin.options.merchantId = null;

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err}) => {
                expect(err).to.be.an.instanceof(Error);

                // server.stop(done);
                done();
            });
    });


    it('should fail to load with a bad publicKey option', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations[5].plugin.options.publicKey = null;

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err}) => {
                expect(err).to.be.an.instanceof(Error);

                // server.stop(done);
                done();
            });
    });


    it('should fail to load with a bad privateKey option', (done) => {
        const manifest = Hoek.clone(serverSetup.manifest);
        manifest.registrations[5].plugin.options.privateKey = null;

        testHelpers
            .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
            .then(({err}) => {
                expect(err).to.be.an.instanceof(Error);

                // server.stop(done);
                done();
            });
    });


    it('should have exposed methods', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server}) => {
                expect(err).not.to.exist();
                expect(server.plugins.Payments.hasOwnProperty('getClientToken')).to.be.true();
                expect(server.plugins.Payments.hasOwnProperty('runPayment')).to.be.true();

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });


    it('should have a Payment model', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();
                expect(server.plugins.BookshelfOrm.bookshelf.model('Payment')).to.be.a.function();

                testHelpers.destroyKnexAndStopServer(server, done);
            });
    });

});
