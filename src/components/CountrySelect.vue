<template>
    <el-select v-model="selectedCountry"
               filterable
               :placeholder="placeholder"
               :no-match-text="$t('No matching values')"
               v-on:change="updateValue">
        <el-option
                v-for="item in countryList"
                :key="item.alpha2"
                :label="item.name"
                :value="item[optionValueAttr]">
        </el-option>
    </el-select>
</template>


<script>
    import Vue from 'vue'
    import { Select } from 'element-ui'
    import { countries } from 'country-data';

    Vue.use(Select)

    export default{
        props: {
            placeholder: {
                type: String,
                default: ''
            },

            // this allows using the `value` prop for a different purpose
            initValue: {
                type: String
            },

            valueType: {
                type: String // alpha2, alpha3, numeric, name
            }
        },

        created() {
            this.selectedCountry = this.initValue;
        },

        methods: {
            updateValue(val) {
                this.$emit('input', val)
            }
        },

        computed: {
            optionValueAttr: function() {
                return (this.valueType && this.countryList[0].hasOwnProperty(this.valueType) ? this.valueType : 'alpha2');
            }
        },

        watch: {
            'initValue' (to, from) {
                this.selectedCountry = to;
            }
        },

        data() {
            return {
                selectedCountry: null,
                countryList: countries.all
            }
        }
    }
</script>

<style>
</style>
