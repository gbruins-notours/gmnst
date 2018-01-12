<script>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

export default {
    components: {
        AppHeader,
        AppFooter
    },
}
</script>

<template>
    <div class="layoutContainer">
        <div>admin header</div>
        <main>
            <slot></slot>
        </main>
        <div>admin footer</div>
    </div>
</template>