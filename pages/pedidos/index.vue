<template>
    <h1 v-if="!loading" class="text-center">
        PEDIDOS
    </h1>
</template>
<script setup>
    const loading = inject("loading");

</script>