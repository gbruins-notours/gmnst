<script>
    export default {
        data: function() {
            return {
                year: new Date().getFullYear()
            }
        }
    }
</script>


<template>
    <footer class="footer">
        <div class="container level">
            <div class="level-item">
                <img src="/static/images/g.svg" alt="gmnst" class="g" />
            </div>

            <div class="level-item">
                <router-link :to="{name: 'returns'}">{{ $t('Returns / Exchanges') }}</router-link>
            </div>

            <div class="level-item">
                <div class="tar fs12">
                    &#169; {{ year }} gmnst.com, {{ $t('All Rights Reserved') }}. 
                    <span class="underline"><router-link :to="{name: 'privacy'}">{{ $t('Privacy') }}</router-link></span> and 
                    <span class="underline"><router-link :to="{name: 'conditions_of_use'}">{{ $t('Conditions') }}</router-link></span>
                </div>
            </div>
        </div>
    </footer>
</template>


<style lang="scss">
    @import "../assets/css/components/_variables.scss";

    .footer {
        background-color: $colorBluePurple;
        margin-top: 50px;
        padding: 20px;
        color: #fff;

        a {
            color: #fff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .g {
            width: 40px;
        }
    }
</style>