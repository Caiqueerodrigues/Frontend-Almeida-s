<template>
    <v-row>
        <v-col>
            <v-dialog 
                width="600px" 
                height="80%" 
                v-model="props.isActiveModal"
                persistent
            >
                <v-card
                    class="text-surface bg-primary text-center "
                    prepend-icon="mdi-currency-brl"
                    :title="`Selecione a data do pagamento`"
                >
                    <template #append>
                        <v-icon
                            @click="setInactiveModal()"
                            size="30"
                        >
                            mdi-close
                        </v-icon>
                    </template>
                    <v-card-text class="px-0 pb-0">
                        <v-row class="justify-center">
                            <v-col cols="12" class="px-0">
                                <v-divider :thickness="4" color="white" />
                            </v-col>
                            <v-col cols="10" class="pa-0 text-center">
                                <DatePicker 
                                    name="dataPagemento"
                                    :date="null"
                                    :onlyDate="true"
                                    @dateEmit="selectedDate = $event"
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <template v-slot:actions>
                        <v-col cols="12">
                            <v-btn
                                class="text-primary font-weight-bold rounded-xl mr-6"
                                size="large"
                                color="white"
                                variant="outlined"
                                @click="setInactiveModal()"
                            >
                                CANCELAR
                            </v-btn>
                            <v-btn
                                class="bg-success text-primary font-weight-bold rounded-xl"
                                size="large"
                                variant="outlined"
                                @click="confirmar()"
                                :disabled="selectedDate === null"
                            >
                                CONFIRMAR
                            </v-btn>
                        </v-col>
                    </template>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>
<script setup>
    const emit = defineEmits(['setInactiveModal', 'confirma'])
    const props = defineProps([ 'isActiveModal']);

    const selectedDate = ref(null);

    const setInactiveModal = () => {
        emit('setInactiveModal', false);
    }
    
    const confirmar = () => {
        emit('confirma', selectedDate.value);
    }
</script>
<style scoped>
    :deep(.v-overlay__scrim) {
        background: #000000;
        opacity: .8;
    }

    img {
        width: 100%;
    }
</style>