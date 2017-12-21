<script>
    import Vue from 'vue'
    import { Button } from 'element-ui'

    Vue.use(Button)

    export default {
        methods: {
            submitShippingMethodForm: function() {
                //TODO: finish this method
                console.log("submitShippingMethodForm")
                this.$emit('done', 'shipping-method-step')
            },
        }
    }
</script>

<template>
    <div>
        <div class="step-title">{{ $t('SHIPPING METHOD') }}:</div>
        TODO

        <div class="ptl tac">
            <div class="inlineBlock">
                <el-button type="warning"
                            class="colorBlack"
                            @click="submitShippingMethodForm"
                            size="large">{{ $t('CONTINUE TO PAYMENT') }}</el-button>
            </div>
        </div>
    </div>
</template>