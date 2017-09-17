<template>
    <div class="payment-methods">
        <div class="item">
            <div class="payment-type-button grow" 
                    :class="{'selected': paymentMethod === 'CREDIT_CARD'}"
                    @click="changeMethod('CREDIT_CARD')">
                <i class="fa fa-credit-card payment-type"></i>
                <i class="fa fa-check-circle"></i>
            </div>
            <div class="fs12 mts">{{ $t('CREDIT CARD') }}</div>
        </div>

        <div class="item">
            <div class="payment-type-button grow"
                    :class="{'selected': paymentMethod === 'PAYPAL'}"
                    @click="changeMethod('PAYPAL')">
                <i class="fa fa-paypal payment-type"></i>
                <i class="fa fa-check-circle"></i>
            </div>
            <div class="fs12 mts">{{ $t('PAYPAL') }}</div>
        </div>
    </div>
</template>


<script>
    export default {
        data: function() {
            return {
                paymentMethod: 'CREDIT_CARD'
            }
        },

        methods: {
            changeMethod(method) {
                this.paymentMethod = method;
                this.$emit('change', method)
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/css/components/_variables.scss";
    @import "../../assets/css/components/_mixins.scss";

    .payment-methods {
        display: table;
        margin: 0 auto;

        .item {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
            padding: 10px;
        }

        .payment-type-button {
            color: $colorGrayLighter !important;
            display: block;
            cursor: pointer;
            padding: 20px;
            @include box-shadow(0px, 1px, 5px, rgba(0,0,0,.3));
            @include border-radius(2px);
            border: 3px solid #fff;
            background-color: #f3f3f3;
            text-align: center;
            min-width: 80px;
            position: relative;

            .fa-check-circle {
                font-size: 20px;
                visibility: hidden;
                position: absolute;
                top: 0;
                right: 0
            }

            .payment-type {
                font-size: 28px;
                color: $colorGrayLighter;
            }

            &:hover {
                border-color: $colorGreen;
            }
            
            &.selected {
                border-color: $colorGreen;
                background-color: #effbee;

                .fa-check-circle {
                    visibility: visible;
                    color: $colorGreen !important;
                }

                .payment-type {
                    color: $colorGreen !important;
                }
            }
        }

        // .item {
        //     font-size: 30px;
        //     padding: 5px;
        //     @include border-radius(2px);
        //     line-height: 30px;
        //     position: relative;
        //     min-width: 80px;

        //     .fa {
        //         vertical-align: middle;
        //     }

        //     .item-desc {
        //         font-size: 12px;
        //     }

        //     .fa-check-circle {
        //         font-size: 16px;
        //     }

        //     &.active {
        //         background-color: #effbee;
        //         border: 1px solid #c8e2c7;
        //         color: $colorGreen !important;
        //     }

        //     &.completed {
        //         color: $colorGreen !important;
        //         cursor: pointer;

        //         &:hover {
        //             border: 1px solid #c8e2c7;
        //         }
        //     }
        // }
    }
</style>
