<template>
    <v-row class="justify-center align-center h-100">
        <v-col cols="10">
            <h2 class="text-secondary text-center">
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

                <template v-slot:[`item.checkbox`]="{ item, index }">
                    <v-checkbox
                        v-model="selecteds[index]"
                        color="success"
                        :value="item"
                        hide-details
                        @change="checkboxSelected(item, index)"
                    ></v-checkbox>
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
                <template v-slot:[`item.dataPedido`]="{ item }">
                    {{ getHours(item.dataPedido) }}
                </template>
                <template v-slot:[`item.modelo.preco`]="{ item }">
                    R$ {{ formattePrice(item.modelo.preco) }}
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
    const emit = defineEmits([ 'verId', 'selecteds' ]);
    const formattePrice = inject('formattePrice');
    const selectedItem = ref(false);
    const router = useRouter();
    const selecteds = ref(props.items.map(() => false));
    const selectedEmitItems = ref([]);

    const checkboxSelected = (item, index) => {
        if(selecteds.value[index]) {
            selectedEmitItems.value.push(item.id);
        } else {
            selectedEmitItems.value = selectedEmitItems.value.filter(selected => selected !== item.id);
        }

        emit('selecteds', selectedEmitItems.value);
    }

    const emitId = (item) => {
        selectedItem.value = item;
        emit('verId', item.id);
    };

    const handleRowClick = (event, { item }) => {
        if (props.redirect) {
            redirect(item);
        }
    };

    const getHours = (date) => {
        return date.toString().split('T')[1];
    }

    const redirect = (item) => {
        router.push(`/pedido/${item.id}`)
    };

    onMounted(() => {
        setTimeout(() => {
            if(!props.acaoVer && props.items.length === 1) selectedItem.value = props.items[0];
        }, 100);
    });
</script>