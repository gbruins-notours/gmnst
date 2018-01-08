const assert = require('assert');

describe('/', () => {
    it('should have title', () => {
        browser.url('/');
        console.log("PAGE TITLE", browser.getTitle())
        assert.equal(browser.getTitle(), 'gmnst2');
    });
});