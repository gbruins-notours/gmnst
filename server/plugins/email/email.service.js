const Promise = require('bluebird');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const Handlebars = require('handlebars');
const forEach = require('lodash.foreach');
const Config = require('../../config');
const mailgun = require('mailgun-js')({apiKey: Config.get('/mailgun/apiKey'), domain: Config.get('/mailgun/domain')});
const mailcomposer = require('mailcomposer');
// const ShoppingCartService = require('../shopping-cart/shopping-cart.service');

let internals = {};

internals.dirPurchaseReceipt = path.join(__dirname, 'templates', 'purchase-receipt');

internals.send = (config) => {
    let p = new Promise( (resolve, reject) => {

        let mail = mailcomposer({
            from: 'thanks@gmnst.com',
            to: config.to,
            subject: config.subject,
            body: config.text,
            html: config.html
        });

        mail.build( (mailBuildError, message) => {
            mailgun
                .messages()
                .sendMime(
                    {
                        to: config.to,
                        message: message.toString('ascii')
                    },
                    (sendError, body) => {
                        if(sendError) {
                            reject(sendError);
                        }
                        else {
                            resolve(body);
                        }
                    }
                );
        });

        // mailgun
        //     .messages()
        //     .internals.send(
        //         {
        //             from: 'Excited User <me@samples.mailgun.org>',
        //             to: config.to,
        //             subject: config.subject,
        //             text: config.text
        //         },
        //         function (error, body) {
        //             if(error) {
        //                 reject(err);
        //             }
        //             else {
        //                 resolve(body);
        //             }
        //         }
        //     );
    });

    return p;
};


function emailPurchaseReceiptToBuyer(ShoppingCart) {
    var p = new Promise( (resolve, reject) => {

            let template = new EmailTemplate(internals.dirPurchaseReceipt);
            let cartData = ShoppingCart.get('cart_data');
            let templateData = {
                cart_items: []
            };

            forEach(cartData, (obj) => {
                templateData.cart_items.push({
                    qty: obj.qty,
                    title: obj.product.title,
                    // price: ShoppingCartService.getCartItemPrice(obj), //TODO
                    // totalPrice: ShoppingCartService.getCartItemTotalPrice(obj) //TODO
                });
            });

            // var locals = {
            //     email: 'mamma.mia@spaghetti.com',
            //     name: {first: 'Mamma', last: 'Mia'}
            // };

            Handlebars.registerHelper('productList', (items, options) => {
                let html = [];
                html.push('<table class="invoice-items" cellpadding="0" cellspacing="0" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; margin: 0;">');

                for(var i=0, l=items.length; i<l; i++) {
                    console.log('options.fn(items[i]) ', options.fn(items[i]) );

                    html.push('<tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">');

                    // product title
                    html.push('<td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" valign="top">' + options.fn(items[i]) + '</td>');

                    // qty
                    // html.push('<td class="alignright" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top">' + options.fn(items[i]) + '</td>');
                    html.push('</tr>');
                    // out = out + "<li>" + options.fn(items[i]) + "</li>";
                }

                html.push('</table>');

                return html.join('');
            });

            // Handlebars.registerHelper('capitalize', function capitalize (context) {
            //     return context.toUpperCase()
            // });
            //
            // Handlebars.registerPartial('name',
            //     '{{ capitalize name.first }} {{ capitalize name.last }}'
            // );

            template
                .render(templateData)
                .then(
                    (results) => {
                        resolve(results);

                        return internals.send({
                            to: ShoppingCart.get('shipping_email'),
                            subject: results.subject,
                            text: results.text,
                            html: results.html
                        });
                    }
                )
                .catch(
                    (error) => {
                        // server.appEvents.emit('email-template-error', error);
                        reject('TEMPLATE RENDER ERROR: ' + error);
                    }
                );
        }
    );

    return p;
}



module.exports.emailPurchaseReceiptToBuyer = emailPurchaseReceiptToBuyer;
