<template>
    <section class="page-header">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h2 class="title is-3 inline">{{ title }}</h2>
                    <slot></slot>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        props: ['title']
    }
</script>

<style lang="scss">
    @import "../assets/css/components/_variables.scss";

    .page-header {
        background-color: #e4e4e4;
        padding: 10px 10px;
    }
</style>
