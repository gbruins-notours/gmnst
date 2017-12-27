<script>
    import UtilityService from '@/utility_service.js'

    let utilityService = new UtilityService();
    let name = utilityService.getSiteName();

    export default {
        props: {
            uppercase: {
                type: Boolean,
                default: false,
            }
        },

        data: function() {
            return {
                siteName: this.uppercase ? name.toUpperCase() : name
            }
        }
    }
</script>

<template>
    <span>{{ siteName }}</span>
</template>