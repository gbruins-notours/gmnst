<template>
    <transition
            name="fade"
            mode="in-out"
            appear
            appear-active-class="fadeIn"
            enter-active-class="fadeIn"
            leave-active-class="fadeOut"
            @beforeEnter="beforeEnter"
            @afterLeave="afterLeave">
        <div class="modal animated is-active" v-if="show">
            <div class="modal-background" @click="deactive"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        <slot name="title"></slot>
                    </p>
                    <button class="delete" @click="deactive"></button>
                </header>
                <section class="modal-card-body">
                    <slot name="content"></slot>
                </section>
                <footer class="modal-card-foot">
                    <slot name="footer"></slot>
                </footer>
            </div>
        </div>
    </transition>
</template>


<script>
export default{
    props: {
        visible: Boolean
    },

    data() {
        return {
            show: this.visible
        }
    },

    methods: {
        deactive () {
            this.show = false
        },

        beforeEnter () {
            this.$emit('card_modal_opened')
        },

        afterLeave () {
            this.$emit('card_modal_closed')
        }
    },

    watch: {
        visible (val) {
            this.show = val
        }
    }
}
</script>

<style>
</style>
