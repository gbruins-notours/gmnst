<template>
    <span class="select">
        <select name="selectedQty" v-model="selectedQty" @change="onChange">
            <option value=""></option>
            <option v-for="qty in quantityOptions" :value="qty">{{ qty }}</option>
        </select>
    </span>
</template>

<script>
export default {
    props: {
        min: Number,
        max: Number,
        initialize: Number
    },

    data() {
        return {
            quantityOptions: [],
            selectedQty: null
        }
    },

/*
    computed: {
        selectedQty() {
            return this.initialize || null
        }
    },
*/

    methods: {
        buildQtyOptions() {
            let opts = [];
            let start = this.min || 1;
            let end = this.max || 100;

            for (; start <= end; start++) {
                opts.push(start);
            }

            this.quantityOptions = opts;
        },

        onChange () {
            this.$emit('number_select_changed', this.selectedQty);
        }
    },

    created() {
        this.buildQtyOptions();
        this.selectedQty = this.initialize || null
    }
}
</script>
