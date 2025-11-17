<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" class="text-center">
            <h2 class="text-center text-secondary mt-4">
                LISTAGEM DE ALTERAÇÕES DE PEDIDOS
            </h2>
            <h2 class="text-center text-secondary">
                {{ textDate }}
            </h2>
            <v-row class="justify-center mt-3">
                <v-col cols="4">
                    <DatePicker 
                        name="dataListagemPedidos"
                        :date="selectedDate"
                        :onlyDate="true"
                        @dateEmit="setDate($event)"
                    />
                </v-col>
                <v-col cols="4">
                    <v-select
                        chips
                        class="mx-4"
                        label="Tipo de Serviço"
                        v-model="filterService"
                        :items="seguimentos"
                        variant="outlined"
                        rounded="xl"
                    ></v-select>
                </v-col>
            </v-row>
            <h2 class="text-secondary text-center mt-12" v-if="pedidosFiltrados.length === 0">
                NÃO EXISTEM ALTERAÇÕES PARA A DATA SELECIONADA
            </h2>
        </v-col>
        <v-col cols="12" class="mb-10" v-if="pedidosFiltrados.length > 0">
            <DataTable 
                title="Listagem de Alterações"
                :items="pedidosFiltrados"
                :headers="nomesColunas" 
                :acaoVer="false"
                :redirect="true"
                @verId="showFormFunc($event)"
            />
        </v-col>
    </v-row>
</template>
<script setup>
    import moment from 'moment-timezone';
    import 'moment/dist/locale/pt-br';
    import { SEGUIMENTOS } from '~/constantes/seguimentos';

    const axios = inject('axios');
    const formatteDateDB = inject("formatteDateDB");
    const router = useRouter();

    const seguimentos = [ 'Todos', ...SEGUIMENTOS ];
    const filterService = ref('Todos');

    const nomesColunas = ref([
        { title: 'ID pedido', align: 'center', key: 'id', width: '10px' },
        { title: 'Cliente', align: 'center', key: 'nomeCliente' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
        { title: 'Categoria', align: 'center', key: 'categoria' },
        { title: 'Modelo', align: 'center', key: 'modelo' },
        { title: 'Cor(es)', align: 'center', key: 'cor' },
        { title: 'ID alteração', align: 'center', key: 'idAlteracao', width: '10px' },
        { title: 'Operacao realizada', align: 'center', key: 'operacaoRealizada' },
        { title: 'Hora alteração', align: 'center', key: 'horaModificacao' },
        { title: 'Usuário', align: 'center', key: 'nomeUsuario' },
    ]);
    const selectedDate = ref(moment().tz('America/Sao_Paulo').toDate());
    const textDate = ref("");
    const pedidos = ref([]);


    const setDate = (ev) => {
        selectedDate.value = moment(ev).tz('America/Sao_Paulo').toDate();
    }

    const getPedidos = async () => {
        let date = moment(selectedDate.value).tz('America/Sao_Paulo').toDate();
        const dateFormatted = formatteDateDB(date);
        const dados = { date: dateFormatted };

        axios.post('/history-orders', dados).then(response => {
            pedidos.value = response.map(item => ({
                ...item,
                id: item.idPedido,
                idAlteracao: item.id,
            }));
        })
    }

    const pedidosFiltrados = computed(() => {
        if(filterService.value !== 'Todos') {
            return pedidos.value.filter(item => item.categoria === filterService.value) ?? [];
        }
        return pedidos.value;
    });

    const getDateAtualBrasilia = (data = moment().tz('America/Sao_Paulo').toDate()) => {
        const date = moment(data)
            .tz('America/Sao_Paulo')
            .locale('pt-br')
            .format('dddd, DD [de] MMMM [de] YYYY');

        return date.charAt(0).toUpperCase() + date.slice(1);
    };

    const showFormFunc = (ev = 0) => {
        router.push(`/pedido/${ev}`);
    };

    watch(() => selectedDate.value, (nv) => {
        if(nv) {
            pedidos.value = [];
            textDate.value = getDateAtualBrasilia(nv); 
            getPedidos();
        }
    });
    
    onMounted(() => {
        getPedidos();
        textDate.value = getDateAtualBrasilia();
    });
</script>