<script>
import DefaultLayout from '@/layouts/DefaultLayout'
import PageHeader from '@/components/PageHeader'
import UtilityService from '@/utility_service.js'

let utilityService = new UtilityService();

export default {
    components: {
        DefaultLayout,
        PageHeader
    },

    data: function() {
        return {
            returnsEmailAddress: utilityService.getHelpEmailAddress()
        }
    },

    metaInfo() {
        return {
            title: this.$t('Returns / Exchanges'),
            meta: [
                { vmid: 'description', name: 'description', content: `Returns and Exchanges for your order at gmnst.com` }
            ]
        }
    }
}
</script>


<template>
    <default-layout>
        <page-header :title="$t('Returns / Exchanges')"></page-header>

        <div class="container tac">
            {{ this.$t('returns_help')}}: 
            <div class="mts fs20">
                <a :href="`mailto:${returnsEmailAddress}`">{{ returnsEmailAddress }}</a>   
            </div>
        </div>
    </default-layout>
</template>


