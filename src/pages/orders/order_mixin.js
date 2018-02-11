import ShoppingCartService from '../cart/ShoppingCartService.js'
let shoppingCartService = new ShoppingCartService();

export default {
    data: function() {
        return {
            orderExists: false,
            order: {
                shipping: {},
                shoppingCart: {},
                transaction: {
                    payment: {}
                }
            }
        }
    },

    computed: {
        formattedName() {
            if(this.order.shipping) {
                return shoppingCartService.getFormattedShippingName(this.order.shipping.firstName, this.order.shipping.lastName);
            }
        },

        formattedCityStateZip: function() {
            if(this.order.shipping) {
                return shoppingCartService.getFormattedCityStateZip(
                    this.order.shipping.locality,
                    this.order.shipping.region,
                    this.order.shipping.postalCode
                );
            }
        },

        companyDisplay: function() {
            if(this.order.shipping) {
                return shoppingCartService.getFormattedCompanyName(this.order.shipping.company);
            }
        },

        cardType: function() {
            if(this.order.transaction.payment.type === 'paypal_account') {
                return 'paypal';
            }

            return this.order.transaction.payment.cardType;
        }
    }
}