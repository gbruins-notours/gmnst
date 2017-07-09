<template>
    <footer class="footer">
        <div class="container">
            <div class="content colorWhite">
                <div class="tar">&#169; {{ year }}, gmnst.com</div>
                    <!-- <a class="icon" href="https://github.com/jgthms/bulma">
                        <i class="fa fa-github"></i>
                    </a> -->
                </p>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        data: function() {
            return {
                year: new Date().getFullYear()
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/css/components/_variables.scss";

    .footer {
        background-color: $colorBluePurple;
        margin-top: 50px;
        padding: 20px;
    }
</style>
