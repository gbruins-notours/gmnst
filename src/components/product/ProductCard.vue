<template>
    <div class="card widthAll">
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
        <footer class="card-footer">
            <!--<a class="card-footer-item">Save</a>-->
            <a class="card-footer-item" v-bind:href="cardUrl">View</a>
            <!--<a class="card-footer-item">Delete</a>-->
        </footer>
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
            },
            cardUrl: function() {
                if (this.product.seo_uri) {
                    return '/item/' + this.product.seo_uri;
                }
                return null;
            }
        }
    }
</script>
