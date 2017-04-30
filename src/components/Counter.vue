<template>
    <div class="counter">
        <h2>Count: {{ $store.state.count }}</h2>
        <button @click="INCREMENT">+1</button>
        <button @click="DECREMENT">-1</button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        methods: mapActions([
            'INCREMENT',
            'DECREMENT'
        ])
    }
</script>
