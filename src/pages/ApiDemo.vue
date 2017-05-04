<template>
    <div class="counter">
        <button @click="sayHello">{{ $t('Get Message') }}</button>
        <button @click="clearMessage">{{ $t('Clear Message') }}</button>
        <div>{{ $t('Message') }}: {{ message }}</div>
    </div>
</template>

<script>
    import api from '../util/api'

    export default {
        data() {
            return {
                message: null
            }
        },
        methods: {
            sayHello() {
                api.sayHello().then((response) => {
                    this.message = response.message;
                });
            },

            clearMessage() {
                this.message = null;
            }
        }
    }
</script>
