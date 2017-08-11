<template>
    <el-select v-if="stateOptions"
               filterable
               v-model="selectedState"
               :placeholder="placeholder"
               v-on:change="updateValue">
        <el-option
                v-for="(label, abbr) in stateOptions"
                :key="abbr"
                :label="$t(label)"
                :value="abbr">
        </el-option>
    </el-select>

    <el-input v-else
            v-model.trim="selectedState"
            v-on:change="updateValue"></el-input>
</template>


<script>
    import Vue from 'vue'
    import { Select } from 'element-ui'
    import states from '../util/countryStates.js'

    Vue.use(Select)

    export default{
        props: {
            placeholder: {
                type: String,
                default: ''
            },

            country: {
                type: String
            },

            // this allows using the `value` prop for a different purpose
            initValue: {
                type: String
            }
        },

        created() {
            this.selectedState = this.initValue;
        },

        methods: {
            updateValue(val) {
                this.$emit('input', val)
            }
        },

        computed: {
            optionValueAttr: function() {
                return (this.valueType && this.countries[0].hasOwnProperty(this.valueType) ? this.valueType : 'alpha2');
            },

            stateOptions: function() {
                return (this.country && states.hasOwnProperty(this.country)) ? states[this.country] : null;
            }
        },

        watch: {
            'initValue' (to, from) {
                this.selectedState = to;
            },

            /**
             * Clear the previously selected state when the country changes
             */
            'country' (to, from) {
                this.selectedState = null;
                this.updateValue(null);
            }
        },

        data() {
            return {
                selectedState: null
            }
        }
    }
</script>

<style>
</style>
