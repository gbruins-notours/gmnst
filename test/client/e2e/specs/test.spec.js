const assert = require('assert');

describe('/', () => {
    it('should have title', () => {
        browser.url('/');
        assert.equal(browser.getTitle(), 'gmnst2');
    });
});