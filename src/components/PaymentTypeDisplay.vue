<script>
    import CreditCardIcon from './CreditCardIcon'

    export default{
        props: {
            cardType: {
                type: String
            },

            lastFour: {
                type: String
            },

            payerEmail: {
                type: String
            }
        },

        components: {
            CreditCardIcon
        }
    }
</script>


<template>
    <span class="ccIcon">
        <credit-card-icon :card-type="cardType"></credit-card-icon>&nbsp;
        <span v-show="lastFour">**** {{ lastFour }}</span>
        <span v-show="payerEmail">{{ payerEmail }}</span>
    </span>
</template>


<style>
    .ccIcon img {
        width: 45px;
        vertical-align: top;
    }
</style>