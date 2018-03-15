'use strict';

const fs = require('fs');
const path = require('path');

const permission = '755';

if(process.env.NODE_ENV === 'production') {
    // adding write permissions to the product folder so 
    // product images can be uploaded/saved from the admin page.
    fs.chmodSync(
        path.join(__dirname, '../dist/static/images/product/'), 
        permission
    );
}