<template>
    <v-row class="justify-center align-center h-100">
        <v-col cols="12" md="4">
            <h2 class="text-secondary text-center py-12">
                {{ props.title }}
            </h2>
            <v-data-table-virtual
                class="bg-secondary rounded-xl text-black"
                :headers="headers"
                :items="items"
                item-value="name"
            >
                <template v-slot:[`item.situacao`]="{ item }">
                    <v-chip :color="item.ativo ? 'success' : 'primary'" text-color="white">
                        <v-icon v-if="item.icons">
                            {{ item.situacao }}
                        </v-icon>
                    </v-chip>
                </template>

                <template v-slot:[`item.preco`]="{ item }">
                    {{ formattePrice(item.preco) }}
                </template>

                <template v-slot:[`item.ver`]="{ item }">
                    <v-btn variant="text" @click="emitId(item)">
                        <v-icon v-if="item.icons">
                            {{ item.ver }}
                        </v-icon>
                    </v-btn>
                </template>
            </v-data-table-virtual>
        </v-col>
    </v-row>
</template>
<script setup>
    const props = defineProps([ 'title', 'items', 'headers', 'acaoVer' ]);
    const emit = defineEmits([ 'verId' ]);
    const formattePrice = inject('formattePrice');

    const emitId = (item) => {
        emit('verId', item.id);
    };
</script>