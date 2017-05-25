<template>
    <div class="card widthAll cursorPointer" @click="goToDetails()">
        <div class="card-image">
            <figure class="image is-square">
                <img v-bind:src="productPic" alt="Image">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{ product.title }}</p>
                    <p class="subtitle is-6"></p>
                </div>
            </div>

            <div class="content">
                {{ product.description_short }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['product'],

        computed: {
            productPic: function() {
                if (this.product.featured_pic) {
                    return '/static/images/product/' + this.product.featured_pic;
                }
                return;
            }
        },

        methods: {
            goToDetails() {
                if (this.product.seo_uri) {
                    this.$router.push(`/item/${this.product.seo_uri}`);
                }
            }
        }
    }
</script>
