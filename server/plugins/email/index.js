'use strict';

const Promise = require('bluebird');
const path = require('path');
const Config = require('../../config');
const mailgun = require('mailgun-js')({apiKey: Config.get('/mailgun/apiKey'), domain: Config.get('/mailgun/domain')});
const mailcomposer = require('mailcomposer');
const pug = require('pug');
const isObject = require('lodash.isobject');

let internals = {};
internals.dirPurchaseReceipt = path.join(__dirname, 'templates', 'purchase-receipt');

internals.send = (config) => {
    return new Promise((resolve, reject) => {
        let mail = mailcomposer({
            from: `${process.env.EMAIL_FROM_CART_SUCCESS_NAME || 'gmnst.com'} <${process.env.EMAIL_FROM_CART_SUCCESS || 'thanks@gmnst.com'}>`,
            to: config.to,
            subject: config.subject,
            body: config.text,
            html: config.html
        });

        mail.build((mailBuildError, message) => {
            mailgun
                .messages()
                .sendMime({
                    to: config.to,
                    message: message.toString('ascii')
                }, (sendError, body) => {
                    if(sendError) {
                        reject(sendError);
                    }
                    else {
                        resolve(body);
                    }
                });
        });
    });
};


internals.emailPurchaseReceiptToBuyer = (ShoppingCart) => {
    return new Promise((resolve, reject) => {
        let file = path.join(__dirname, 'templates', 'purchase-receipt.pug')
        let html = pug.renderFile(file, {
            myname: 'greg' //TODO: add real template variables
        });

        internals.send({
            to: ShoppingCart.get('shipping_email'),
            subject: internals.buildPurchaseReceiptEmailSubject(ShoppingCart),
            text: 'sample text for purchase receipt', //TODO:
            html: html
        });
    })
}


internals.buildPurchaseReceiptEmailSubject = (ShoppingCart) => {
    let cart = ShoppingCart.toJSON()
    let totalNumItems = cart.num_items;
    let cart_items = cart.cart_items;
    let firstItem = null;
    let remainingItems = 0;

    if(Array.isArray(cart_items)) {
        if(isObject(cart_items[0]) && isObject(cart_items[0].product) && cart_items[0].product.hasOwnProperty('title')) {
            firstItem = internals.substringOnWords(cart_items[0].product.title);
            remainingItems = totalNumItems - 1;

            if(!remainingItems) {
                return `Your gmnst.com order of "${firstItem}"`;
            }
        }

        let itemText = remainingItems === 1 ? 'item' : 'items';
        return `Your gmnst.com order of "${firstItem}" and ${remainingItems} more ${itemText}`;
    }

    return 'Your gmnst.com order';
}


/**
 * Creates a substring but does not break up words
 * 
 * @param str The string to trim
 * @param maxLen The maximum length to trim the string to
 * @param suffix The suffix to append to the end of the string if it is trimmed.  Pass null to append nothing.
 */
internals.substringOnWords = (str, maxLen, suffix) => {
    let cleanStr = str.trim();
    let end = (suffix === undefined ? '...' : '');
    let max = parseInt(maxLen, 10) || 25;
    let arr = cleanStr.length ? cleanStr.split(' ') : [];
    let words = [];
    let finalCount = 0;
    let forEachDone = false;

    arr.forEach((part, index) => {
        if(!forEachDone) {
            let pl = part.length;
            let lengthIncludingSpaces = index > 0 ? pl + 1 : pl;

            if(finalCount + lengthIncludingSpaces <= max) {
                words.push(part);
                finalCount += lengthIncludingSpaces;
            }
            else {
                forEachDone = true;
            }
        }
    });

    // If there is nothing in 'words' then the original string 'cleanStr'
    // had no spaces in it, so we'll just return the truncated 'cleanStr'
    if(!words.length) {
        return cleanStr.length > max ? cleanStr.substring(0, max) + end : cleanStr;
    }

    let done = words.join(' ');
    return (cleanStr.length > done.length ? done + end : done);
}


exports.register = function (server, options, next) {

    server.on('payment-success', (ShoppingCart) => {
        internals
            .emailPurchaseReceiptToBuyer(ShoppingCart)
            .catch((err) => {
                let cartId = ShoppingCart.get('id');
                let msg = `Unable to send email confirmation to user after successful purchase: (ShoppingCart ID: ${cartId}) ${err}`;

                global.logger.error(msg)
                global.appInsightsClient.trackException({
                    exception: new Error(msg)
                });
            });
    });

    return next();
};

exports.register.attributes = require('./package.json');
