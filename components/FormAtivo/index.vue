<template>
    <span class="text-secondary">Está ativo?</span>
        <v-radio-group 
        v-model="props.valueInicial"
        inline
        class="d-flex justify-center text-black font-weight-bold"
    >
        <v-radio
            label="Sim"
            :value="true"
            @click="emitValue(true)"
        ></v-radio>
        <v-radio
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