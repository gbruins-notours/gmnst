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
                <router-link :to="{name: 'privacy'}">{{ $t('Privacy Notice') }}</router-link>
            </div>

            <div class="level-item">
                <router-link :to="{name: 'conditions_of_use'}">{{ $t('Conditions of Use') }}</router-link>
            </div>

            <div class="level-item">
                <div class="tar">&#169; {{ year }} gmnst.com</div>
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