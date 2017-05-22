<template>
    <div>
        <header role="banner" class="Header">
            <div class="Header-brand">
                <a href="/"><img class="Header-logo" src="/static/images/logo_header.png" alt="gmnst"></a>
            </div>

            <a class="Header-cart" @click="openModal">
                <span class="icon is-medium"><i class="fa fa-shopping-cart"></i></span>
                <sup class="badge">2</sup>
            </a>

            <nav class="Header-middle Navigation">
                <ul class="Navigation-list">
                    <li class="Navigation-item" v-for="(val, key) in appInfo.product.subTypes">
                        <a class="Navigation-link" :href="'/type/' + appInfo.seoUri[key]">{{ $tc(key, 2) }}</a>
                    </li>
                </ul>
            </nav>
        </header>

        <card-modal :visible="modalIsActive"
                    v-on:card_modal_closed="closeModal"
                    v-on:card_modal_opened="onModalOpened">
            <div slot="title">{{ $t('Shopping Cart') }}</div>
            <div slot="content">

                <div class="box">
                    <article class="media">
                        <figure class="media-left">
                            <p class="image is-64x64">
                                <img src="http://bulma.io/images/placeholders/128x128.png">
                            </p>
                        </figure>
                        <div class="media-content">
                            <div class="content">
                                <strong>Product Title</strong>
                            </div>

                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <small>Quantity:</small>&nbsp;
                                        <number-select v-on:number_select_changed="changed"
                                                       min="0"
                                                       max="100"
                                                       initialize="3"></number-select>
                                    </div>
                                    <div class="level-item">
                                        <small>Size:</small>&nbsp;
                                        SMALL
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="media-right">
                            <!--<button class="delete"></button>-->
                            <!--<product-price product=""></product-price>-->
                        </div>
                    </article>
                </div>

            </div>
            <div slot="footer">
                <a class="button is-primary">OK</a>
                <a class="button">cancel</a>
            </div>
        </card-modal>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import CardModal from './CardModal.vue';
    import NumberSelect from './NumberSelect.vue';
    import ProductPrice from './product/ProductPrice.vue';

    export default {
        props: {
            show: Boolean
        },

        components: {
            CardModal,
            NumberSelect,
            ProductPrice
        },

        data() {
            return {
                showBigLogo: window.innerWidth > 480,
                modalIsActive: false
            }
        },

        computed: {
            ...mapGetters({
                appInfo: 'appInfo'
            })
        },

        methods: {
            ...mapActions([
                'ADD_TO_CART'
            ]),

            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },

            handleResize() {
                if (window.innerWidth > 480) {
                    this.showBigLogo = true
                }
                else {
                    this.showBigLogo = false
                }
            },

            openModal() {
                this.modalIsActive = true;
            },

            closeModal() {
                this.modalIsActive = false;
            },

            onModalOpened() {
                console.log('TODO: get cart contents')
            },

            changed(val) {
                console.log('changed', val)
            }
        },

        created() {
            window.addEventListener('resize', this.handleResize)
        }
    }
</script>

<style lang="scss">
    .Header {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        background-color: #fff;
        box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
    }

    .Header-brand {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        width: 80%;
        padding-left: 0.75em;
        color: #02182B;
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
            height: 2.5rem!important;
            color: white!important;
        }

        .fa {
            color: white!important;
        }

        &:hover,
        &:focus {
            background-color: #389955;
        }
    }

    .Header-logo {
        display: inline-block;
        width: 140px;
        margin-top: 7px;
    }

    .Navigation {
        background-color: whitesmoke;
        color: #010101;
        width: 100%;
        padding-bottom: 0.9em;
        padding-top: 0.9em;
    }

    .Navigation-list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: distribute;
        justify-content: space-around;
        -ms-flex-item-align: center;
        align-self: center;
        margin: 0;
    }

    .Navigation-item {
        list-style: none;
        padding: 0;
        text-transform: uppercase;
    }

    .Navigation-link {
        color: #7a7a7a;
        font-size: 0.8rem;
        text-decoration: none;

        &:hover,
        &:focus {
            color: #363636;
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
        transform: translateY(-70%) translateX(70%);
        box-shadow: 0 0 1px 1px rgba(10, 10, 10, 0.1);
    }

    @media all and (min-width: 42em) {
        .Header {
            height: 50px;
            -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
        }
        .Header-brand {
            max-width: 170px;
            padding-top: 0.85em;
            padding-bottom: 0.7em;
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
        .Navigation-link {
            font-size: 1rem;
            padding: 0 1em;
        }
    }

    @media all and (min-width: 63em) {
        .Header {
            height: 73px;
        }
        .Header-brand {
            max-width: 220px;
        }
        .Header-logo {
            width: 180px;
        }
    }
</style>
