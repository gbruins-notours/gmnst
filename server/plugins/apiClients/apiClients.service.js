const Promise = require('bluebird');
const bcrypt = require('bcrypt');


/**
 * Creates a hash from a given password
 *
 * @param password
 * @returns {Promise}
 */
function cryptPassword(password) {
    return new Promise( (resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }

                return resolve(hash); 
            });
        });
    });
}


/**
 * Compares a password against the hashed password for a match
 *
 * @param password      Clear password
 * @param userPassword  Hashed password
 * @returns {Promise}
 */
function comparePassword(password, userPassword) {
    return new Promise( (resolve, reject) => {
        bcrypt.compare(password, userPassword, (err, isPasswordMatch) => {
            if (err) {
                return reject(err);
            }

            return resolve(isPasswordMatch);
        });
    });
}


module.exports.cryptPassword = cryptPassword;
module.exports.comparePassword = comparePassword;