<template>
    <span class="ccIcon">
        <credit-card-icon :card-type="cardType"></credit-card-icon>&nbsp;<span v-show="lastFour">**** {{ lastFour }}</span>
    </span>
</template>

<script>
    import CreditCardIcon from './CreditCardIcon'

    export default{
        props: {
            cardType: {
                type: String,
                default: ''
            },

            lastFour: {
                type: String,
                default: ''
            }
        },

        components: {
            CreditCardIcon
        }
    }
</script>

<style>
    .ccIcon img {
        width: 45px;
        vertical-align: top;
    }
</style>