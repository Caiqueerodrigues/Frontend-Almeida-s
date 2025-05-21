<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" class="text-center">
            <h2 class="text-center text-secondary">
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
        <v-col cols="12" v-if="pedidos.length > 0">
            <DataTable 
                title="Listagem de Alterações"
                :items="pedidos"
                :headers="nomesColunas" 
                :acaoVer="true"
                @verId="showFormFunc($event)"
            />
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject('axios');
    const formatteDateDB = inject("formatteDateDB");
    const router = useRouter();

    const nomesColunas = ref([
        { title: 'ID pedido', align: 'center', key: 'id' },
        { title: 'Cliente', align: 'center', key: 'nomeCliente', width: '30px' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
        { title: 'Operacao realizada', align: 'center', key: 'operacaoRealizada' },
        { title: 'Hora pedido', align: 'center', key: 'horaModificacao' },
        { title: 'Modelo', align: 'center', key: 'modelo' },
        { title: 'Cor(es)', align: 'center', key: 'cor' },
        { title: 'Usuário', align: 'center', key: 'nomeUsuario' },
        { title: 'Ações', align: 'center', key: 'ver' },
    ]);
    const selectedDate = ref(new Date());
    const textDate = ref("");
    const pedidos = ref([]);


    const setDate = (ev) => {
        const date = new Date(ev);
        selectedDate.value = date;
    }

    const getPedidos = async () => {
        let date = new Date(selectedDate.value);
        const dateFormatted = formatteDateDB(date);
        const dados = { date: dateFormatted };

        axios.post('/history-orders', dados).then(response => {
            pedidos.value = response;
        })
    }

    const getDateAtualBrasilia = (data = new Date()) => {
        const date = new Date(data).toLocaleDateString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            weekday: 'long', 
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return date.replace(/^\w/, (c) => c.toUpperCase()).replace(/\s\w/g, (c) => c.toUpperCase());
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