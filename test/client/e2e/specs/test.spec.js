const assert = require('assert');

describe('PAGE: /', () => {
    it('should have title', () => {
        browser.url('/');
        console.log("PAGE TITLE", browser.getTitle())
        assert.equal(browser.getTitle(), 'gmnst');
    });
});