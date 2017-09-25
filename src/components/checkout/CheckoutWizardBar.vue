<template>
    <div class="checkout-wizard">
        <div class="item" 
             :class="{'active': currentStep === 0, 'completed': currentStep > 0}"
             @click="changeStep(0)">
            <i class="fa fa-truck"></i>
            <div class="item-desc nowrap">1) {{ $t('SHIPPING') }}</div>
        </div>

        <div class="spacer">
            <hr style="width:100%;" />
        </div>

        <div class="item" 
             :class="{'active': currentStep === 1, 'completed': currentStep > 1}"
             @click="changeStep(1)">
            <i class="fa fa-handshake-o"></i>
            <div class="item-desc nowrap">2) {{ $t('PAYMENT') }}</div>
        </div>

        <div class="spacer">
            <hr style="width:100%;" />
        </div>

        <div class="item" 
             :class="{'active': currentStep === 2, 'completed': currentStep > 2}"
             @click="changeStep(2)">
            <i class="fa fa-shopping-cart"></i>
            <div class="item-desc nowrap">3) {{ $t('REVIEW') }}</div>
        </div>

        <div class="spacer">
            <hr style="width:100%;" />
        </div>

        <div class="item" :class="{'active': currentStep === 3, 'completed': currentStep > 3}">
            <i class="fa fa-file-text-o"></i>
            <div class="item-desc nowrap">4) {{ $t('RECEIPT') }}</div>
        </div>
    </div>
</template>


<script>
    export default{
        props: {
            step: {
                type: Number,
                default: 1
            }
        },

        data: function() {
            return {
                currentStep: 1
            }
        },

        created() {
            this.currentStep = this.step;
        },

        methods: {
            /**
             * Changes the current step number if the new step is less than 
             * the current step
             */
            changeStep(stepNum) {
                if(this.currentStep > stepNum) {
                    this.currentStep = stepNum;
                    this.$emit('change', stepNum)
                }
            }
        },

        watch: {
            'step' (to, from) {
                this.currentStep = to;
            }
        }

    }
</script>

<style lang="scss">
    @import "../../assets/css/components/_variables.scss";
    @import "../../assets/css/components/_mixins.scss";

    .checkout-wizard {
        width: 100%;
        display: flex;
        display: -webkit-flex; /* Safari */
        align-items: center;
        flex-direction: row;
        -webkit-flex-direction: row; /* Safari */
        flex-wrap: nowrap;
        -webkit-flex-wrap: nowrap; 

        .item,
        .spacer {
            text-align: center;
            color: $colorGrayLighter !important;
            vertical-align: middle;
        }

        .spacer {
            padding: 0 8px;
            flex-grow: 1;
        }

        .item {
            font-size: 18px;
            padding: 3px;
            @include border-radius(2px);
            line-height: 18px;
            border: 1px solid transparent;

            .fa {
                vertical-align: middle;
            }

            .item-desc {
                font-size: 10px;
            }

            &.active {
                background-color: #effbee;
                border: 1px solid #c8e2c7;
                color: $colorGreen !important;
            }

            &.completed {
                color: $colorGreen !important;
                cursor: pointer;

                &:hover {
                    border: 1px solid #c8e2c7;
                }
            }
        }
    }
        
    @media #{$medium-and-up} {  
        .checkout-wizard {
            .spacer {
                padding: 0 15px;
            }

            .item {
                font-size: 25px;
                line-height: 25px;

                .item-desc {
                    font-size: 12px;
                }
            }
        }
    }
</style>
