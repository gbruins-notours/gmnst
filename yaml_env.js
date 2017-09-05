(function () {
    const yaml = require('js-yaml');
    const fs = require('fs');
    const isObject = require('lodash.isobject')

    var doc = yaml.safeLoad(
        fs.readFileSync('app.yaml', 'utf8'), 
        { json: true }
    );

    // The .env file will take precedence over the settings the app.yaml file
    if(process.env.NODE_ENV !== 'production') {
        require('dotenv/config');
    }

    if(isObject(doc) && isObject(doc.env_variables)) {
        Object.keys(doc.env_variables).forEach(function (key) {
            // Dont set environment with the yaml file value if it's already set
            process.env[key] = process.env[key] || doc.env_variables[key]
        })
    }
})()
