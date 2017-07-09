<template>
    <footer class="footer">
        <div class="container">
            <div class="content has-text-centered">
                <p>
                    <strong>Bulma</strong> by <a href="http://jgthms.com">Jeremy Thomas</a>. The source code is licensed
                    <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
                    is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
                </p>
                <p>
                    <a class="icon" href="https://github.com/jgthms/bulma">
                        <i class="fa fa-github"></i>
                    </a>
                </p>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    @import "../assets/css/components/_variables.scss";

    .footer {
        background-color: inherit;
        border-top: 1px solid #f7c9e1;
        margin-top: 50px;

        .content {
            color: #fff;
        }
    }
</style>
