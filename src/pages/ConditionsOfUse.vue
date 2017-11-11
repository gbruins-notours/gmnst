<script>
    import PageHeader from '../components/PageHeader';

    export default {
        components: {
            PageHeader
        },

        data: function() {
            return {
                siteName: 'gmnst.com',
                siteNameUpper: 'GMNST.COM',
            }
        }
    }
</script>


<template>
    <section>
        <page-header :title="$t('Conditions of Use')"></page-header>

        <div class="container priv">
           TODO
        </div>
    </section>
</template>


<style lang="scss">
    .priv {
        h2 {
            font-weight: bold;
            font-size: 20px;
            line-height: 35px;  
            margin-top: 20px;
        }

        p {
            margin-top: 15px;
        }

        ul {
            margin: 14px 0 14px 28px;
            padding-left: 0;

            li {
                list-style: disc;
            }
        }
    }
</style>