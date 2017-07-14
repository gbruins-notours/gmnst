<template>
    <div class="checkoutSteps">
        <div class="level is-mobile man pbs fs12">
            <div class="level-item">
                <template v-if="step > 1">
                    <a @click="goToShipping">1) {{ labelShipping }}</a>
                    <i class="pls el-icon-circle-check colorGreen"></i>
                </template>
                <template v-else class="fwb">1) {{ labelShipping }}</template>
            </div>

            <div class="level-item">
                <template v-if="step > 2">
                    <a @click="goToShippingMethod">2) {{ labelShippingMethod }}</a>
                    <i class="pls el-icon-circle-check colorGreen"></i>
                </template>
                <template v-else>2) {{ labelShippingMethod }}</template>
            </div>

            <div class="level-item">3) {{ $t('Place Order') }}</div>
        </div>
        <el-progress :show-text="false"
                    :stroke-width="18"
                    :percentage="percent"
                    status="success"></el-progress>
    </div>
</template>


<script>
    import Vue from 'vue'
    import { Progress } from 'element-ui'

    Vue.use(Progress)

    export default{
        props: {
            step: {
                type: Number,
                default: 1
            }
        },

        computed: {
            percent: function() {
                switch(this.step) {
                    case 1:
                        return 25;
                    case 2:
                        return 50;
                    default:
                        return 85;
                }
            }
        },

        data: function() {
            return {
                labelShipping: this.$t('Shipping'),
                labelShippingMethod: this.$t('Shipping Method')
            }
        },

        methods: {
            goToShipping: function() {
                this.$router.push({ name: 'checkout_shipping' });
            },

            goToShippingMethod: function() {
                this.$router.push({ name: 'checkout_shipping_method' });
            }
        }
    }
</script>

<style>
    .checkoutSteps {
        margin: 20px 10px 40px;
    }

    .el-progress.is-success .el-progress-bar__inner {
        background-color: #6ea76b !important;
    }
</style>
