const Code = require('code');
const Lab = require('lab');
const Hoek = require('hoek');
const Info = require('../../../server/plugins/info');
const Payments = require('../../../server/plugins/payments');
const Products = require('../../../server/plugins/products');
const testHelpers = require('../../testHelpers');
const serverSetup = require('./_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing Info plugin', () => {

  // it('errors on missing CrumbCsrf plugin', (done) => {
  //     const manifest = Hoek.clone(serverSetup.manifest);
  //
  //     // removing CrumbCsrf plugin
  //     manifest.registrations.splice(2, 1);
  //
  //     Server.init(manifest, serverSetup.composeOptions, (err, server) => {
  //         expect(err).to.exist();
  //         expect(err.message).to.include(`missing dependency ${CrumbCsrf.register.attributes.name}`);
  //
  //         testHelpers.destroyKnexAndStopServer(server, done);
  //     });
  // });


  it('errors on missing Products plugin', (done) => {
      const manifest = Hoek.clone(serverSetup.manifest);

      // also removing the ShoppingCart plugin because it also requires Products,
      // and will throw an error first, which breaks the test
      // manifest.registrations.splice(4, 1);

      // removing Products plugin
      manifest.registrations.splice(6, 1);

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
      manifest.registrations.splice(7, 1);

      testHelpers
          .startServerAndGetHeaders(manifest, serverSetup.composeOptions)
          .then(({err, server}) => {
              expect(err).to.exist();
              expect(err.message).to.include(`missing dependency ${Payments.register.attributes.name}`);

              testHelpers.destroyKnexAndStopServer(server, done);
          });
  });


  /*
   * ROUTE: GET /info
   */
   require('./routes/info');

});
