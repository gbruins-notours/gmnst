<template>
    <div>
        <template v-if="!inCheckoutFlow">
            <header role="banner" class="Header">
                <div class="Header-container">
                    <div class="Header-brand cursorPointer" v-on:click="goHome">
                        <img class="Header-image" src="static/images/logo_header.png" alt="gmnst">
                    </div>

                    <a class="Header-cart">
                        <span class="icon is-medium"><i class="fa fa-shopping-cart"></i></span>
                        <sup class="badge">{{ numCartItems }}</sup>
                    </a>

                    <nav class="Header-middle Navigation">
                        <ul class="Navigation-list">
                            <router-link :to="'/type/' + appInfo.seoUri[key]"
                                         tag="li"
                                         exact-active-class="active"
                                         v-for="(val, key) in appInfo.product.subTypes"
                                         :key="key">{{ $tc(key, 2) }}</router-link>
                        </ul>
                    </nav>
                </div>
            </header>
        </template>
        <template v-else>
            <header role="banner" class="Header">
                <div class="container">
                    <div class="columns">
                        <div class="cursorPointer column is-one-third" v-on:click="goHome" style="border:1px solid blue">
                            <img class="Header-image" src="static/images/logo_header.png" alt="gmnst">
                        </div>
                        <div class="column is-one-third tac fs24 colorBlack" style="border:1px solid blue">
                            {{ $t('Checkout') }}
                        </div>
                        <div class="column is-one-third tar" style="border:1px solid blue">
                            <span class="icon is-medium"><i class="fa fa-lock colorGrayLighter"></i></span>
                        </div>
                    </div>
                </div>
            </header>
        </template>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import isObject from 'lodash.isobject'
    import ProductPrice from './product/ProductPrice.vue';

    export default {
        components: {
            ProductPrice
        },

        data() {
            return {
                showBigLogo: window.innerWidth > 480
            }
        },

        computed: {
            ...mapGetters([
                'appInfo',
                'numCartItems',
                'inCheckoutFlow'
            ])
        },

        methods: {
            handleResize() {
                if (window.innerWidth > 480) {
                    this.showBigLogo = true
                }
                else {
                    this.showBigLogo = false
                }
            },

            goHome: function() {
                this.$router.push('/');
            },

            dispatchCheckoutFlow: function(route) {
                let isCartPage = (isObject(route) && route.name && route.name.indexOf('cart') === 0);
                console.log("NAVBAR - IS CART PAGE", isCartPage);
                this.$store.dispatch('IN_CHECKOUT_FLOW', isCartPage);
            }
        },

        created: function() {
            window.addEventListener('resize', this.handleResize);
            this.dispatchCheckoutFlow(this.$route)
        },

        watch: {
            // React to route param changes:
            '$route' (to, from) {
                this.dispatchCheckoutFlow(to);
            }
        }
    }
</script>

<style lang="scss">
    .Header {
        background-color: #fff;
        box-shadow: 0 1px 1px rgba(10, 10, 10, 0.1);
        position: relative;
    }

    .Header-container {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        flex-direction: row;
    }

    .Header-brand {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        flex-grow: 1;
        align-items: center;
        color: #02182B;
        margin-left: 20px;
    }

    .Header-image {
        display: inline-block;
        width: 140px;
        margin-top: 7px;
    }

    .Header-cart {
        font-family: Helvetica, Arial, sans-serif;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        width: 20%;
        height: 57px;
        background-color: #3faf63;
        margin-left: 0;

        .icon {
            height: 30px !important;
            color: white !important;
        }

        .fa {
            color: white!important;
        }

        &:hover,
        &:focus {
            background-color: #389955;
        }
    }

    .Navigation {
        background-color: whitesmoke;
        color: #010101;
        width: 100%;
    }

    .Navigation-list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: distribute;
        justify-content: space-around;
        -ms-flex-item-align: center;
        align-self: center;
        margin: 0 20px 0 0;
        margin: 0;

        li {
            list-style: none;
            padding: 0;
            text-transform: uppercase;
            color: #7a7a7a;
            font-size: 14px;
            text-decoration: none;
            cursor: pointer;
            padding: 0 10px;
            height: 50px;
            line-height: 50px;

            &:hover,
            &:focus {
                color: #363636;
            }

            &.active {
                border-bottom: 3px solid #41b883;
                color: #000;
            }
        }
    }

    .badge {
        background-color: #ef59a3;
        border-radius: 10px;
        color: #fff;
        display: inline-block;
        font-size: 14px;
        height: 18px;
        line-height: 18px;
        padding: 0 6px 0 5px;
        text-align: center;
        white-space: nowrap;
        position: absolute;
        transform: translateY(-70%) translateX(60%);
        box-shadow: 0 0 1px 1px rgba(10, 10, 10, 0.1);
    }

    @media all and (min-width: 42em) {
        .Header {
            height: 50px;
        }
        .Header-container {
            -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
        }
        .Header-brand {
            max-width: 170px;
        }
        .Header-cart {
            -webkit-box-ordinal-group: 4;
            order: 3;
            -ms-flex-order: 3;
            -webkit-flex-order: 3;
            width: auto;
            height: auto;
            padding-left: 1.2em;
            padding-right: 1.5em;
            margin-left: 20px;
        }

        .Navigation {
            background-color: white;
            padding: 0;
            -webkit-box-ordinal-group: 3;
            -ms-flex-order: 2;
            order: 2;
            width: auto;
            -webkit-box-flex: 2;
            -ms-flex-positive: 2;
            flex-grow: 2;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-item-align: center;
            align-self: center;
            -webkit-box-pack: end;
            -ms-flex-pack: end;
            justify-content: flex-end;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
        }
        .Navigation-list {
            -webkit-box-pack: end;
            -ms-flex-pack: end;
            justify-content: flex-end;
        }
    }

    @media all and (min-width: 63em) {
        .Header {
            height: 73px;
        }
        .Header-brand {
            max-width: 220px;
        }
        .Header-image {
            width: 180px;
        }
        .Navigation-list li {
            height: 73px;
            line-height: 78px;
        }
    }
</style>
