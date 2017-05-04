'use strict';

const EmailService = require('./email.service');


exports.register = function (server, options, next) {
    // server.appEvents.on(
    //     'gmnst-payment-success',
    //     (ShoppingCart) => {
    //         EmailService
    //             .emailPurchaseReceiptToBuyer(ShoppingCart)
    //             .catch(
    //                 (err) => {
    //                     let cartId = ShoppingCart.get('id');
    //                     let msg = `Unable to send email confirmation to user after successful purchase: (ShoppingCart ID: ${ cartId }) ${ err }`;
    //                     server.log(['error'], msg);
    //                 }
    //             );
    //     }
    // );

    // server.appEvents.on('email-template-error', (err) => {
    //     server.log(['error'], err);
    // });

    return next();
};

exports.register.attributes = require('./package.json');
