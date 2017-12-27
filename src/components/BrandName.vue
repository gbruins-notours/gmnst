<script>
    import UtilityService from '@/utility_service.js'

    let utilityService = new UtilityService();
    let name = utilityService.getBrandName();

    export default {
        props: {
            uppercase: {
                type: Boolean,
                default: false,
            }
        },

        data: function() {
            return {
                brandName: this.uppercase ? name.toUpperCase() : name
            }
        }
    }
</script>

<template>
    <span>{{ brandName }}<sup>&reg;</sup></span>
</template>