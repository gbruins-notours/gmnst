import ShoppingCartService from '../cart/shopping_cart_service.js'
let shoppingCartService = new ShoppingCartService();

export default {
    data: function() {
        return {
            order: {
                shipping: {},
                shoppingCart: {},
                transaction: {}
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
            if(this.order.transaction.paymentInstrumentType === 'paypal_account') {
                return 'paypal';
            }
            
            if(this.order.transaction.hasOwnProperty('creditCard')) {
                return this.order.transaction.creditCard.cardType;
            }
            
            return null;
        },

        lastFour: function() {
            if(this.order.transaction.hasOwnProperty('creditCard')) {
                return this.order.transaction.creditCard.last4;
            }
            return null;
        },

        payerEmail: function() {
            if(this.order.transaction.hasOwnProperty('paypalAccount')) {
                return this.order.transaction.paypalAccount.payerEmail;
            }
            return null;
        }
    }
}