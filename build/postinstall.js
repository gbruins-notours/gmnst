'use strict';

const fs = require('fs');
const path = require('path');

// adding write permissions to the product folder so 
// product images can be uploaded/saved from the admin page.
if(process.env.NODE_ENV === 'production') {
    fs.chmodSync(
        path.join(__dirname, '../dist/static/images/product/'), 
        '644'
    );
}