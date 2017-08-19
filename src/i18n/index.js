import enUS from './en_US';

export default {
    locale: 'en-US',

    messages: {
        'en-US': enUS
    },

    // http://kazupon.github.io/vue-i18n/en/datetime.html
    dateTimeFormats: {
        'en-US':  {
            'short': {
                year: 'numeric', month: 'short', day: 'numeric'
            },
            'long': {
                year: 'numeric', month: 'short', day: 'numeric',
                weekday: 'short', hour: 'numeric', minute: 'numeric'
            }
        }
    },

    // http://kazupon.github.io/vue-i18n/en/number.html
    numberFormats: {
        'en-US': {
            currency: {
                style: 'currency', currency: 'USD'
            }
        },
        'ja-JP': {
            currency: {
                style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
            }
        }
    }
}
