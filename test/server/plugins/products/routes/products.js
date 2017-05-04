const Lab = require('lab');
const Code = require('code');
const _ = require('lodash');
const testHelpers = require('../../../testHelpers');
const serverSetup = require('../_serverSetup');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;


describe('Testing route: GET /products', () => {

    it('should get a list of products', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();
                
                //TODO
                // params.where = ['is_available', '=', true];
                // params.andWhere = [
                //     ['product_type_id', '=', parseInt(productType)],
                //     ['inventory_count', '>', 0]
                // ];
                // params.orderBy = 'updated_at';
                // params.orderDir = 'DESC';


                const request = {
                    method: 'GET',
                    url: '/products?where=["id", "=", "999"]',
                    headers
                };

                // request.params.is_available = true;
                // request.payload.where = ['id', '=', 999];

                server.inject(request, (res) => {
                    // console.log('res.result.data', JSON.parse(JSON.stringify(res.result.data)));

                    expect(res.statusCode, 'Status code').to.equal(200);

                    testHelpers.destroyKnexAndStopServer(server, done);
                });
            });
    });


    it('product should have related info (artist, category, sizes, etc)', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

                const request = {
                    method: 'GET',
                    url: '/products?where=["id", "=", "1"]',
                    headers
                };

                server.inject(request, (res) => {
                    let data = JSON.parse(JSON.stringify(res.result.data));

                    expect(res.statusCode, 'Status code').to.equal(200);
                    expect(data[0].hasOwnProperty('sizes'), 'Related info: sizes').to.equal(true);
                    expect(data[0].hasOwnProperty('genders'), 'Related info: genders').to.equal(true);
                    expect(data[0].hasOwnProperty('pics'), 'Related info: pics').to.equal(true);
                    expect(data[0].hasOwnProperty('artist'), 'Related info: artist').to.equal(true);
                    expect(data[0].hasOwnProperty('type'), 'Related info: type').to.equal(true);
                    expect(data[0].hasOwnProperty('category'), 'Related info: category').to.equal(true);

                    testHelpers.destroyKnexAndStopServer(server, done);
                });
            });
    });


    it('should get one product when searching by id using "where" URL param', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();

                const Product = server.plugins.BookshelfOrm.bookshelf.model('Product');

                const attributes = {
                    title: 'title',
                    description_short: 'description_short',
                    description_long: 'description_long',
                    sku: 'sku'
                };

                Product
                    .forge()
                    .save(attributes)
                    .then(
                        (Prod) => {
                            const productId = Prod.attributes.id;
                            const request = {
                                method: 'GET',
                                url: `/products?where=["id", "=", "${productId}"]`,
                                headers
                            };

                            server.inject(request, (res) => {
                                let data = JSON.parse(JSON.stringify(res.result.data));

                                expect(res.statusCode, 'Status code').to.equal(200);
                                expect(data.length).to.equal(1);
                                expect(data[0]['id']).to.equal(productId);

                                _.forEach(attributes, (val, key) => {
                                    expect(data[0][key]).to.equal(val);
                                });

                                // clean up
                                Prod.destroy().finally(
                                    () => {
                                        testHelpers.destroyKnexAndStopServer(server, done);
                                    }
                                );
                            });
                        }
                    );
            });
    });


    it('should get one product when searching by id using "andWhere" URL param', (done) => {
        testHelpers
            .startServerAndGetHeaders(serverSetup.manifest, serverSetup.composeOptions)
            .then(({err, server, headers}) => {
                expect(err).not.to.exist();
                
                const Product = server.plugins.BookshelfOrm.bookshelf.model('Product');

                const attributes = {
                    title: 'title',
                    sku: 'sku'
                };

                Product
                    .forge()
                    .save(attributes)
                    .then(
                        (Prod) => {
                            const productId = Prod.attributes.id;
                            const request = {
                                method: 'GET',
                                url: `/products?where=["id", "=", "${productId}"]&andWhere=[["title", "=", "title"],["sku", "=", "sku"]]`,
                                headers
                            };

                            server.inject(request, (res) => {
                                let data = JSON.parse(JSON.stringify(res.result.data));

                                expect(res.statusCode, 'Status code').to.equal(200);
                                expect(data.length).to.equal(1);
                                expect(data[0]['id']).to.equal(productId);

                                _.forEach(attributes, (val, key) => {
                                    expect(data[0][key]).to.equal(val);
                                });

                                // clean up
                                Prod.destroy().finally(
                                    () => {
                                        testHelpers.destroyKnexAndStopServer(server, done);
                                    }
                                );
                            });
                        }
                    );
            });
    });

});
