<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import CheckoutWizardBar from '@/components/checkout/CheckoutWizardBar'
    import ShippingAddressStep from '@/components/checkout/ShippingAddressStep'
    import ShippingMethodStep from '@/components/checkout/ShippingMethodStep'
    import PlaceOrderStep from '@/components/checkout/PlaceOrderStep'

    let currentNotification = null;

    export default {
        components: {
            CheckoutWizardBar,
            ShippingAddressStep,
            ShippingMethodStep,
            PlaceOrderStep
        },

        computed: {
            ...mapGetters([
                'cart',
            ])
        },

        data: function() {
            return {
                stepComponent: 'shipping-address-step',
                STEP_SHIPPING_ADDRESS: 0,
                STEP_SHIPPING_METHOD: 1,
                STEP_PLACE_ORDER: 2,
                currentStep: 0
            }
        },

        methods: {
            componentDone: function(val) {
                switch(val) {
                    case 'shipping-address-step':
                        this.stepComponent = 'shipping-method-step';
                        this.currentStep = this.STEP_SHIPPING_METHOD;
                        break;

                    case 'shipping-method-step':
                        this.stepComponent = 'place-order-step';
                        this.currentStep = this.STEP_PLACE_ORDER;
                        break;

                    default:
                        this.stepComponent = 'shipping-address-step';
                        this.currentStep = this.STEP_SHIPPING_ADDRESS;
                }
            },

            checkoutStepChanged: function(newStep) {
                if(newStep < this.currentStep) {
                    this.currentStep = newStep;

                    switch(newStep) {
                        case this.STEP_SHIPPING_METHOD:
                            this.stepComponent = 'shipping-method-step';
                            break;

                        case this.STEP_PLACE_ORDER:
                            this.stepComponent = 'place-order-step';
                            break;

                        default:
                            this.stepComponent = 'shipping-address-step';
                    }
                }
            }
        },

        mounted: function() {
            this.$store.dispatch('IN_CHECKOUT_FLOW', true);
        }
    }
</script>


<template>
    <div>
        <section v-if="cart.num_items" class="container-wizard">
            <div class="container-skinny">
                <checkout-wizard-bar :step="currentStep" @change="checkoutStepChanged"></checkout-wizard-bar>
            </div>
        </section>

        <section class="container-skinny pal">
            <div v-if="!cart.num_items" class="fs16 pal tac">
                {{ $t('Your shopping cart does not contain any items.') }}
            </div>

            <template v-else>
                <component v-bind:is="stepComponent" @done="componentDone"></component>
            </template>
        </section>
    </div>
</template>


<style lang="scss">
    .container-wizard {
        padding: 7px;
        background-color: #f1f1f1;
    }

    .step-title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 20px;
        text-align: center;
    }
</style>
