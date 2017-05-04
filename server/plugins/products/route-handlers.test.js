'use strict';

const Lab = require('lab');
const Code = require('code');
// const RouteHandlers = require('./route-handlers');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


// describe("app-products route handlers", function() {
//
//     it("Each handler should be an object", function (done) {
//         expect( RouteHandlers.findById ).to.be.an.object();
//         expect( RouteHandlers.findProducts ).to.be.an.object();
//
//         done();
//     });
//
//     it("Each handler should include a description and a handler", function (done) {
//         var includeArray = ['description', 'handler'];
//
//         expect( RouteHandlers.findById ).to.include( includeArray );
//         expect( RouteHandlers.findProducts ).to.include( includeArray );
//
//         done();
//     });
//
// });