'use strict';

const Promise = require('bluebird');
const path = require('path');
const Config = require('../../config');
const mailgun = require('mailgun-js')({apiKey: Config.get('/mailgun/apiKey'), domain: Config.get('/mailgun/domain')});
const mailcomposer = require('mailcomposer');
const pug = require('pug');

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
            myname: 'greg'
        });

        internals.send({
            to: ShoppingCart.get('shipping_email'),
            subject: 'Your gmnst.com order of some t-shirt',
            text: 'sample text for purchase receipt',
            html: html
        });
    })
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
