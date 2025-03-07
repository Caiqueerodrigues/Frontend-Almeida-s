<template>
    <span class="text-secondary">Está ativo?</span>
        <v-radio-group 
        v-model="props.valueInicial"
        inline
        class="d-flex justify-center"
    >
        <v-radio
            color="white"
            label="Sim"
            :value="true"
            @click="emitValue(true)"
        ></v-radio>
        <v-radio
            color="white"
            label="Não"
            :value="false"
            @click="emitValue(false)"
        ></v-radio>
    </v-radio-group>
</template>
<script setup>
    const props = defineProps([ 'valueInicial' ]);
    const emit = defineEmits([ 'SetValue' ]);

    const emitValue = (valor) => emit('setValue', valor);
</script>