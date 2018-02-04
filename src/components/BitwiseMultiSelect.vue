<script>
import Vue from 'vue'
import { Select } from 'element-ui'

Vue.use(Select);

export default {
    props: {
        placeholder: {
            type: String,
            default: ''
        },

        options: {
            type: Array,
            required: true
        }
    },

    data: function() {
        return {
            selectedVal: null
        }
    }
}
</script>

<template>
    <el-select v-model="selectedVal" multiple :placeholder="placeholder">
        <el-option
            v-for="(val, key) in options"
            :key="val"
            :label="key"
            :value="val">
        </el-option>
    </el-select>
</template>

<style lang="scss">

</style>