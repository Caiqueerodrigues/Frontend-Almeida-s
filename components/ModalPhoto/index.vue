<template>
    <v-row>
        <v-col>
            <v-dialog 
                max-width="100%" 
                max-height="95%" 
                v-model="props.isActiveModal"
                persistent
            >
                <v-card
                    class="text-surface bg-primary text-center "
                    prepend-icon="mdi-image"
                    :title="`Imagem da faca ${props.dadosFoto.nomePeca}`"
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
                                <img :src="props.dadosFoto.url" :alt="`Foto da faca ${props.dadosFoto.nomePeca}`">
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <template v-slot:actions>
                        <v-col cols="12">
                            <v-btn
                                class="bg-success text-primary font-weight-bold rounded-xl"
                                size="large"
                                variant="outlined"
                                @click="setInactiveModal()"
                            >
                                OK
                            </v-btn>
                        </v-col>
                    </template>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>
<script setup>
    const emit = defineEmits(['setInactiveModal'])
    const props = defineProps([ 'isActiveModal', 'dadosFoto']);

    const setInactiveModal = () => {
        emit('setInactiveModal', false)
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