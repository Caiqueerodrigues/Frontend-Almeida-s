<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="11">
            <FormPedido 
                :id="idPedido"
            />
        </v-col>
    </v-row>
</template>
<script setup>
    const route = useRoute();
    const idPedido = ref(route.params.id);

</script>
<style scoped>
    .z-1 {
        z-index: 1 !important;
    }

    .z-2 {
        z-index: 2 !important;
    }
</style>