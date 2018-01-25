<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import { Popover, Button } from 'element-ui'

    Vue.use(Popover);
    Vue.use(Button);

    export default {
        computed: {
            ...mapGetters({
                productInfo: 'app/productInfo'
            })
        }
    }
</script>

<template>
    <div class="inlineBlock">
        <el-popover
            ref="keepshoppingpopover"
            placement="bottom"
            width="150"
            trigger="click">
           <div class="fs14 tac">
               <div>{{ $t('Shop for') }}:</div>
               <div class="tac pts keepShoppingLinks">
                   <router-link
                       v-for="(val, key) in productInfo.subTypes"
                       :key="key"
                       :to="`/type/${productInfo.seoUri[key]}`"
                       tag="a">{{ $tc(key, 2) }}</router-link>
               </div>
           </div>
        </el-popover>

        <el-button class="colorBlack"
                   size="large"
                   v-popover:keepshoppingpopover>{{ $t('CONTINUE SHOPPING') }}</el-button>
    </div>
</template>

<style lang="scss">
    .keepShoppingLinks {
        a {
            display: block;
            margin: 5px 0 10px 0;
        }
    }
</style>
