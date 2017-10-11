<template>
    <section class="container">
        <div class="container-skinny">

            <div class="fs30 tac mtl fwb">{{ $t('Thanks.') }}</div>

            <div class="mtl">
                <div class="displayTableRow">
                    <div class="displayTableCell prm pbs">{{ $t('Order') }}:</div>
                    <div class="displayTableCell fwb pbs">{{ $route.params.id }}</div>
                </div>

                <div class="displayTableRow">
                    <div class="displayTableCell prm pbs">{{ $t('# items') }}:</div>
                    <div class="displayTableCell fwb pbs"></div>
                </div>

                <div class="displayTableRow">
                    <div class="displayTableCell prm pbs">{{ $t('Shipping') }}:</div>
                    <div class="displayTableCell fwb pbs"></div>
                </div>

                <div class="displayTableRow">
                    <div class="displayTableCell prm pbs">{{ $t('Total') }}:</div>
                    <div class="displayTableCell fwb pbs"></div>
                </div>
            </div>

            <div class="mtl">
                <div class="fwb">{{ $t('Payment') }}:</div>
                <div>TODO</div>
            </div>

            <div class="mtl">
                <div class="fwb">{{ $t('Ship to') }}:</div>
                <div></div>
            </div>

        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import api from '../../util/api'

    export default {

        created() {
            api.getOrderById(this.$route.params.id)
                .then((order) => {
                    this.order = order;
                });
        }

    }
</script>

<style lang="scss">

</style>
