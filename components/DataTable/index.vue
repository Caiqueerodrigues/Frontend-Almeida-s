<template>
    <v-row class="justify-center align-center h-100 px-3">
        <v-col cols="12">
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
                    <div class="centered-cell texto-truncado">
                        <v-chip :color="item.ativo ? 'success' : 'primary'" text-color="white">
                            <v-icon v-if="item.icons">
                                {{ item.situacao }}
                            </v-icon>
                        </v-chip>
                    </div>
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
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="item.nome" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    {{ item.nome }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>

                <template v-slot:[`item.nomeCliente`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="item.nomeCliente" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    {{ item.nomeCliente }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.dia`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        {{ item.dia }}
                    </div>
                </template>

                <template v-slot:[`item.preco`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="'R$ ' + formattePrice(item.preco)" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    R$ {{ formattePrice(item.preco) }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.totalDinheiro`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="'R$ ' + formattePrice(item.totalDinheiro)" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    R$ {{ formattePrice(item.totalDinheiro) }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.dataPedido`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="getHours(item.dataPedido)" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    {{ getHours(item.dataPedido) }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.modelo.tipo`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="item.modelo.tipo" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    {{ item.modelo.tipo }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.modelo.preco`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="'R$ ' + formattePrice(item.modelo.preco)" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    R$ {{ formattePrice(item.modelo.preco) }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.precoPar`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="'R$ ' + formattePrice(item.precoPar)" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    R$ {{ formattePrice(item.precoPar) }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.valorCompra`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="'R$ ' + formattePrice(item.valorCompra)" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    R$ {{ formattePrice(item.valorCompra) }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.obs`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="item.obs" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    {{ item.obs }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.quemCortou`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="item.quemCortou" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    {{ item.quemCortou }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.cor`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-tooltip :text="getDadosJoin(item.cor)" class="custom-tooltip">
                            <template v-slot:activator="{ props }">
                                <span v-bind="props">
                                    {{ getDadosJoin(item.cor) }}
                                </span>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
                <template v-slot:[`item.jaFoiPago`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-icon v-if="item.jaFoiPago === 'Sim'" size="40" class="text-success">
                            mdi-check
                        </v-icon>
                        <v-icon v-if="item.jaFoiPago === 'Não'" size="40" class="text-error">
                            mdi-close
                        </v-icon>
                    </div>
                </template>
                <template v-slot:[`item.ativo`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-icon v-if="item.ativo" size="40" class="text-success">
                            mdi-check
                        </v-icon>
                        <v-icon v-if="!item.ativo" size="40" class="text-error">
                            mdi-close
                        </v-icon>
                    </div>
                </template>

                <template v-slot:[`item.ver`]="{ item }">
                    <div class="centered-cell texto-truncado">
                        <v-btn variant="text" @click="emitId(item)">
                            <v-icon v-if="props.acaoVer">
                                mdi-pencil
                            </v-icon>
                            <v-icon v-if="!props.acaoVer" size="30" :class=" itemEqualItemSelected(item) ? 'text-success' : '' ">
                                mdi-check-bold
                            </v-icon>
                        </v-btn>
                    </div>
                </template>

            </v-data-table-virtual>
        </v-col>
    </v-row>
</template>
<script setup>
    import { getDadosJoin } from '~/services/helpers';

    const showToastify = inject('showToastify');

    const props = defineProps([ 'title', 'items', 'headers', 'acaoVer', 'redirect', 'itemComplete', 'selectedItem' ]);
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

    const itemEqualItemSelected = (item) => {
        return item === selectedItem.value || item.id === props.selectedItem?.id;
    };

    const emitId = (item) => {
        selectedItem.value = item;
        if(props.itemComplete) emit('verId', item);
        else emit('verId', item.idPedido ?? item.id);
    };

    const handleRowClick = (event, { item }) => {
        const el = event.target;

        const isCheckbox = el.closest('.v-checkbox');

        if (isCheckbox) return;

        if(item.tipo || item.anotacoes || item.telefone) return emitId(item)

        if (props.redirect) {
            if(item.operacaoRealizada && item.operacaoRealizada === 'Pedido apagado') {
                showToastify('Não é possível navegar para pedidos que foram apagados.', 'info');
                return;
            }
            redirect(item);
        }
    };

    const getHours = (date) => {
        return `${date.toString().split('T')[0].split('-')[2]}-${date.toString().split('T')[0].split('-')[1]}-${date.toString().split('T')[0].split('-')[0]} às ${date.toString().split('T')[1]}`;
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
<style scoped>
    .centered-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        word-break: break-word;
        white-space: normal
    }

    :deep(tr.v-data-table__tr.v-data-table__tr--clickable:hover) {
        background-color: #ad5021 !important;
        transition: background 0.5s;
    }
</style>