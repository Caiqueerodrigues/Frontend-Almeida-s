<template>
    <v-dialog 
        max-width="30%" 
        height="40%" 
        v-model="props.showModal"
        persistent
    >
        <v-card
            class="text-surface bg-primary text-center "
            prepend-icon="mdi-border-color"
            :title="`Aapagar Pedido`"
        >
            <template #append>
                <v-icon
                    @click="emitEvent('setInactiveModal', false)"
                    size="30"
                >
                    mdi-close
                </v-icon>
            </template>
            <v-card-text class="px-0 pb-0">
                <v-divider :thickness="4" color="white" />
                <div class="d-flex flex-column justify-center align-center">
                    <h3>
                        {{ msg }}
                    </h3>
                    <h3 v-if="msg2">
                        {{ msg2 }}
                    </h3>
                </div>
            </v-card-text>
            <template v-slot:actions>
                <v-col cols="12">
                    <v-btn
                        class="bg-primary text-white font-weight-bold rounded-xl mr-4 px-3"
                        size="large"
                        variant="outlined"
                        @click="emitEvent('setInactiveModal', false)"
                    >
                        {{ props.textCancel }}
                    </v-btn>
                    <v-btn
                        class="bg-success text-primary font-weight-bold rounded-xl px-3"
                        size="large"
                        variant="outlined"
                        @click="emitEvent('confirmAction', true)"
                    >
                        {{ props.textConfirm }}
                    </v-btn>
                </v-col>
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup>
    const props = defineProps([ 'showModal', 'idPedido', 'msg', 'msg2', 'textCancel', 'textConfirm' ]);
    const emit = defineEmits([ 'setInactiveModal', 'confirmAction' ]);

    const emitEvent = (event, value) => {
        emit(event, value);
    };
</script>
<style scoped>
:deep(.v-overlay__scrim) {
    background: #000000;
    opacity: .8;
}
</style>