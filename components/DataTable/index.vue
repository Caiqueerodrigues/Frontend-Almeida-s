<template>
    <v-row class="justify-center align-center h-100">
        <v-col cols="12" md="6">
            <h2 class="text-secondary text-center py-12">
                {{ props.title }}
            </h2>
            <v-data-table-virtual
                class="bg-secondary rounded-xl text-black"
                :headers="headers"
                :items="items"
                item-value="name"
                :no-data-text="'Sem dados para mostrar'"
                @click:row="handleRowClick"
            >
                <template v-slot:[`item.situacao`]="{ item }">
                    <v-chip :color="item.ativo ? 'success' : 'primary'" text-color="white">
                        <v-icon v-if="item.icons">
                            {{ item.situacao }}
                        </v-icon>
                    </v-chip>
                </template>

                <template v-slot:[`item.nome`]="{ item }">
                    {{ item.nome }}
                </template>
                <template v-slot:[`item.dia`]="{ item }">
                    {{ item.dia }}
                </template>

                <template v-slot:[`item.preco`]="{ item }">
                    R$ {{ formattePrice(item.preco) }}
                </template>
                <template v-slot:[`item.totalDinheiro`]="{ item }">
                    R$ {{ formattePrice(item.totalDinheiro) }}
                </template>

                <template v-slot:[`item.ver`]="{ item }">
                    <v-btn variant="text" @click="emitId(item)">
                        <v-icon v-if="props.acaoVer">
                            mdi-pencil
                        </v-icon>
                        <v-icon v-if="!props.acaoVer" size="30" :class="item === selectedItem ? 'text-success' : '' ">
                            mdi-check-bold
                        </v-icon>
                    </v-btn>
                </template>

            </v-data-table-virtual>
        </v-col>
    </v-row>
</template>
<script setup>
    const props = defineProps([ 'title', 'items', 'headers', 'acaoVer', 'redirect' ]);
    const emit = defineEmits([ 'verId' ]);
    const formattePrice = inject('formattePrice');
    const selectedItem = ref(false);
    const router = useRouter()

    const emitId = (item) => {
        selectedItem.value = item;
        emit('verId', item.id);
    };

    const handleRowClick = (event, { item }) => {
        if (props.redirect) {
            redirect(item);
        }
    };


    const redirect = (item) => {
        router.push(`/pedidos/${item.id}`)
    };

    onMounted(() => {
        setTimeout(() => {
            if(!props.acaoVer && props.items.length === 1) selectedItem.value = props.items[0];
        }, 100);
    });
</script>