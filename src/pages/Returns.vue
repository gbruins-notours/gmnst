<script>
    import PageHeader from '../components/PageHeader';

    export default {
        components: {
            PageHeader
        },

        data: function() {
            return {
                returnsEmailAddress: 'help@gmnst.com'
            }
        }
    }
</script>


<template>
    <section>
        <page-header :title="$t('Returns / Exchanges')"></page-header>

        <div class="container tac">
            {{ this.$t('returns_help')}}: 
            <div class="mts fs20">
                <a :href="`mailto:${returnsEmailAddress}`">{{ returnsEmailAddress }}</a>   
            </div>
        </div>
    </section>
</template>


