<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" class="text-center">
            <h2 class="text-center text-secondary mt-4">
                LISTAGEM DE ALTERAÇÕES DE PEDIDOS
            </h2>
            <h2 class="text-center text-secondary">
                {{ textDate }}
            </h2>
            <div class="w-50 mx-auto mt-3">
                <DatePicker 
                    name="dataListagemPedidos"
                    :date="selectedDate"
                    :onlyDate="true"
                    @dateEmit="setDate($event)"
                />
            </div>
            <h2 class="text-secondary text-center mt-12" v-if="pedidos.length === 0">
                NÃO EXISTEM ALTERAÇÕES PARA A DATA SELECIONADA
            </h2>
        </v-col>
        <v-col cols="12" class="mb-10" v-if="pedidos.length > 0">
            <DataTable 
                title="Listagem de Alterações"
                :items="pedidos"
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

    const axios = inject('axios');
    const formatteDateDB = inject("formatteDateDB");
    const router = useRouter();

    const nomesColunas = ref([
        { title: 'ID pedido', align: 'center', key: 'id', width: '10px' },
        { title: 'Cliente', align: 'center', key: 'nomeCliente' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
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

    const getDateAtualBrasilia = (data = moment().tz('America/Sao_Paulo').toDate()) => {
        const date = moment(data).tz('America/Sao_Paulo').format('dddd, DD [de] MMMM [de] YYYY');
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