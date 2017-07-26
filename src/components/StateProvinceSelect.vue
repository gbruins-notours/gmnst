<template>
    <el-select v-if="stateOptions"
               v-model="selectedState"
               :placeholder="placeholder"
               v-on:change="updateValue">
        <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="$t(item.name)"
                :value="item.value">
        </el-option>
    </el-select>

    <el-input v-else
            v-model.trim="selectedState"
            v-on:change="updateValue"></el-input>
</template>


<script>
    import Vue from 'vue'
    import { Select } from 'element-ui'

    Vue.use(Select)

    let states = {
        US: [
            { name: "Alabama", value: "AL" },
            { name: "Alaska", value: "AK" },
            { name: "Arizona", value: "AZ" },
            { name: "Arkansas", value: "AR" },
            { name: "California", value: "CA" },
            { name: "Colorado", value: "CO" },
            { name: "Connecticut", value: "CT" },
            { name: "Delaware", value: "DE" },
            { name: "Florida", value: "FL" },
            { name: "Georgia", value: "GA" },
            { name: "Hawaii", value: "HI" },
            { name: "Idaho", value: "ID" },
            { name: "Illinois", value: "IL" },
            { name: "Indiana", value: "IN" },
            { name: "Iowa", value: "IA" },
            { name: "Kansas", value: "KS" },
            { name: "Kentucky", value: "KY" },
            { name: "Louisiana", value: "LA" },
            { name: "Maine", value: "ME" },
            { name: "Maryland", value: "MD" },
            { name: "Massachusetts", value: "MA" },
            { name: "Michigan", value: "MI" },
            { name: "Minnesota", value: "MN" },
            { name: "Mississippi", value: "MS" },
            { name: "Missouri", value: "MO" },
            { name: "Montana", value: "MT" },
            { name: "Nebraska", value: "NE" },
            { name: "Nevada", value: "NV" },
            { name: "New Hampshire", value: "NH" },
            { name: "New Jersey", value: "NJ" },
            { name: "New Mexico", value: "NM" },
            { name: "New York", value: "NY" },
            { name: "North Carolina", value: "NC" },
            { name: "North Dakota", value: "ND" },
            { name: "Ohio", value: "OH" },
            { name: "Oklahoma", value: "OK" },
            { name: "Oregon", value: "OR" },
            { name: "Pennsylvania", value: "PA" },
            { name: "Rhode Island", value: "RI" },
            { name: "South Carolina", value: "SC" },
            { name: "South Dakota", value: "SD" },
            { name: "Tennessee", value: "TN" },
            { name: "Texas", value: "TX" },
            { name: "Utah", value: "UT" },
            { name: "Vermont", value: "VT" },
            { name: "Virginia", value: "VA" },
            { name: "Washington", value: "WA" },
            { name: "West Virginia", value: "WV" },
            { name: "Wisconsin", value: "WI" },
            { name: "Wyoming", value: "WY" }
        ],
        CA: [
            { name: "Alberta", value: "AB" },
            { name: "British Columbia", value: "BC" },
            { name: "Manitoba", value: "MB" },
            { name: "New Brunswick", value: "NB" },
            { name: "Newfoundland and Labrador", value: "NL" },
            { name: "Northwest Territories", value: "NT" },
            { name: "Nova Scotia", value: "NS" },
            { name: "Nunavut", value: "NU" },
            { name: "Ontario", value: "ON" },
            { name: "Prince Edward Island", value: "PE" },
            { name: "Quebec", value: "QC" },
            { name: "Saskatchewan", value: "SK" },
            { name: "Yukon", value: "YT" }
        ],
        AU: [
            { name: "Australian Capital Territory", value: "ACT" },
            { name: "New South Wales", value: "NSW" },
            { name: "Northern Territory", value: "NT" },
            { name: "Queensland", value: "QLD" },
            { name: "South Australia", value: "SA" },
            { name: "Tasmania", value: "TAS" },
            { name: "Victoria", value: "VIC" },
            { name: "Western Australia", value: "WA" }
        ]
    };

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
