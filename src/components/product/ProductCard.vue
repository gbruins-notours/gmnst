<template>
    <div class="card" style="width:100%">
        <div class="card-image">
            <figure class="image is-4by3">
                <img src="http://bulma.io/images/placeholders/1280x960.png" alt="Image">
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
            <a class="card-footer-item" v-bind:href="getCardUrl(product.id, product.seo_uri)">View</a>
            <!--<a class="card-footer-item">Delete</a>-->
        </footer>
    </div>
</template>

<script>
    export default {
        props: ['product'],
        methods: {
            getCardUrl(productId, seoUri) {
                let path = '#/item/' + productId;

                if (seoUri) {
                    path += '-' + seoUri;
                }

                return path;
            }
        }
    }
</script>
