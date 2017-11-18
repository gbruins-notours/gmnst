'use strict';

const queryString = require('query-string');
const Lab = require('lab');
const Code = require('code');
const testHelpers = require('../../../testHelpers');
const serverSetup = require('../_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing route: GET /order', () => {
    it('should contain the correct attributes in the response', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

                let paramString = queryString.stringify(
                    {
                        page: 1,
                        limit: 5
                    }, 
                    { arrayFormat: 'bracket' }
                );

                server
                    .inject({
                        method: 'GET',
                        url: `/orders?${paramString}`,
                        headers
                    })
                    .then((res) => {
                        let data = res.result.data.toJSON();

                        expect(res.statusCode, 'Status code').to.equal(200);

                        return server.inject({
                            method: 'GET',
                            url: `/order?transaction_id=${data[0].transaction_id}`,
                            headers
                        })
                    })
                    .then((res) => {
                        let data = res.result.data;
    
                        expect(res.statusCode, 'Status code').to.equal(200);
                        expect(data.hasOwnProperty('transaction_id')).to.equal(true);
                        expect(data.hasOwnProperty('amount')).to.equal(true);
                        expect(data.hasOwnProperty('shoppingCart')).to.equal(true);
                        expect(data.hasOwnProperty('shipping')).to.equal(true);
                        expect(data.hasOwnProperty('transaction')).to.equal(true);
    
                        testHelpers.destroyKnexAndStopServer(server, done);
                    });
            });
    });
});
