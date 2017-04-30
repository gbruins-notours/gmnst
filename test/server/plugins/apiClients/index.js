const Code = require('code');
const Lab = require('lab');
const ApiClients = require('../../../../server/plugins/apiClients');
// const CrumbCsrf = require('../../../../server/plugins/crumbCsrf');
const testHelpers = require('../../testHelpers');
const serverSetup = require('./_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;



describe('Testing ApiClients plugin', () => {

    // it('errors on missing Info plugin', (done) => {
    //     const manifest = Hoek.clone(serverSetup.manifest);
    //     manifest.registrations.splice(2, 1);
    //
    //     Server.init(manifest, serverSetup.composeOptions, (err, server) => {
    //         // expect(err).to.exist();
    //         // expect(err.message).to.include('Plugin ' + Info.register.attributes.name + ' missing dependency ' + ApiClients.register.attributes.name);
    //         expect('foo').to.exist();
    //
    //         testHelpers.destroyKnexAndStopServer(server, done);
    //     });
    // });


    /*
     * ROUTE: POST /token/get
     */
    require('./routes/token-get');

});




