<template>
    <v-row class="h-100 justify-center align-center mb-4">
        <v-col cols="12" class="mt-4 text-center">
            <h2 class="text-center text-secondary">
                RELATÓRIOS
            </h2>
        </v-col>
        <v-col cols="12" class="mt-4 text-center">
            <span CLASS="text-center text-h5 font-weight-bold text-secondary">
                SELECIONE O DIA OU PERÍODO
            </span>
        </v-col>
        <v-col cols="4" v-if="!loading">
            <VueDatePicker 
                v-model="date" 
                range 
                autoApply
                locale="pt-BR"
                dark
                format="dd/MM/yyyy"
                :clearable="false"
                :min-date="minDate"
                :max-date="now"
            />
        </v-col>
        <v-col cols="3">
            <v-select
                chips
                label="Cliente"
                v-model="filter.client"
                :items="clientes"
                :disabled="clientes.length === 1"
                variant="outlined"
                rounded="xl"
            ></v-select>
        </v-col>
        <v-col cols="2">
            <v-select
                chips
                label="Situação"
                v-model="filter.situation"
                :items="[ 'Todos', 'Pagos', 'Devidos' ]"
                :disabled="clientes.length === 1"
                variant="outlined"
                rounded="xl"
            ></v-select>
        </v-col>
        <v-col cols="2">
            <v-select
                chips
                label="Tipo Serviço"
                v-model="filter.tipo"
                :items="[ 'Todos', 'Corte', 'Debruagem', 'Dublagem' ]"
                :disabled="clientes.length === 1"
                variant="outlined"
                rounded="xl"
            ></v-select>
        </v-col>
        <v-col cols="12" class="text-center" v-if="!loading && pedidos.length  > 0">
            <span class="text-h5 text-secondary font-weight-bold">
                Total Faturado no período é R$ {{ totalReceber }}
            </span>
            <br>
            <DataTable
                :title="'Listagem de pedidos ' + pedidosFiltrados.length + ' - ' + 'Total de pares/metros ' + totalPares"
                :items="pedidosFiltrados"
                :headers="nomesColunas"
                :acaoVer="true"
                :redirect="true"
                class="mb-2"
            />
        </v-col>
        <v-col cols="12" class="text-center" v-if="!loading && pedidos.length  === 0">
            <span class="text-secondary text-h5 font-weight-bold">
                NÂO EXISTEM PEDIDOS PARA ESTE PERÍODO
            </span>
        </v-col>
        <v-col cols="12" class="text-center">
            <v-btn variant="flat" color="success" rounded="xl" @click="showModalRelatorios = true">
                GERAR RELATÓRIOS
            </v-btn>
        </v-col>
    </v-row>
    <ModalRelatorios 
        :isActiveModal="showModalRelatorios"
        :date="date"
        @setInactiveModal="showModalRelatorios = $event"
    />
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import moment from 'moment-timezone';

    const axios = inject("axios");
    const loading = inject("loading");
    const formatteDateDB = inject("formatteDateDB");
    const date = ref([
        moment().tz('America/Sao_Paulo').toDate(),
        moment().tz('America/Sao_Paulo').toDate()
    ]);
    const minDate = moment('2000-01-01').tz('America/Sao_Paulo').toDate();
    const now = moment().tz('America/Sao_Paulo').toDate();
    const pedidos = ref([]);
    const nomesColunas = ref([
        { title: 'ID pedido', align: 'center', key: 'id' },
        { title: 'Nome', align: 'center', key: 'nome' },
        { title: 'Dia', align: 'center', key: 'dia', width: '120px' },
        { title: 'Modelo', align: 'center', key: 'modelo.tipo' },
        { title: 'Rendimento', align: 'center', key: 'modelo.rendimento' },
        { title: 'Cor(es)', align: 'center', key: 'cor' },
        { title: 'Total de pares/mts', align: 'center', key: 'totalPares' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
        { title: 'Pago?', align: 'center', key: 'jaFoiPago' },
        { title: 'Quem concluiu', align: 'center', key: 'quemCortou' },
        { title: 'Quem retirou', align: 'center', key: 'quemAssinou' },
        { title: 'Observação', align: 'center', key: 'obs', maxWidth: '250px' },
    ]);
    const showModalRelatorios = ref(false);
    const filter = ref({ client: 'Todos', situation: 'Todos', tipo: "Todos" });

    const getPedidos = async () => {
        const initialDate = moment(date.value[0]).tz('America/Sao_Paulo').format('YYYY-MM-DD');
        const finalDate = moment(date.value[1]).tz('America/Sao_Paulo').format('YYYY-MM-DD');
        filter.value.client = "Todos";
        filter.value.situation = "Todos";
        filter.value.tipo = "Todos";

        await axios.get(`/orders/period/${initialDate}/${finalDate}`).then(response => {
            pedidos.value = [];

            if(response.length > 0) {
                response.map(item => {
                    const datePedido = moment(item.dataPedido).tz('America/Sao_Paulo');
                    const dia = datePedido.format('DD-MM-YYYY');

                    pedidos.value.push(
                        { ...item, totalDinheiro: item.totalDinheiro, dia, nome: item.client.nome, id: item.id }
                    );
                });
            }
        }).catch(e => console.error(e));
    }

    const totalPares = computed(() => {
        return pedidosFiltrados.value.reduce((acc , item) => acc + item.totalPares, 0).toFixed(0);
    });
    
    const clientes = computed(() => {
        const nomes = ['Todos'];
        pedidos.value.map(item => {
            if(!nomes.includes(item.client.nome)) nomes.push(item.client.nome)
        })
        return nomes;
    });

    const pedidosFiltrados = computed(() => {
        let filtrados = pedidos.value;

        if (filter.value.client !== "Todos")  {
            filtrados = filtrados.filter(pedido => pedido.client?.nome === filter.value.client);
        }

        if(filter.value.situation !== "Todos") {
            const situation = filter.value.situation === 'Devidos' ? "Não" : "Sim";
            filtrados = filtrados.filter(pedido => pedido?.jaFoiPago === situation);
        }

        if (filter.value.tipo !== 'Todos') {
            filtrados = filtrados.filter(pedido => pedido.categoria.toLowerCase() === filter.value.tipo.toLowerCase());
        }
        return filtrados
    });

    const totalReceber = computed(() => {
        return pedidosFiltrados.value.reduce((acc , item) => acc + item.totalDinheiro, 0).toFixed(2);
    });

    watch(() => date.value, (nv) => {
        if(nv) getPedidos();
    });

    onBeforeMount(() => getPedidos())
</script>
<style scoped>
    :deep(.dp__input) {
        background-color: #A60014;
        border-radius: 20px;
        border-color: #eeff00;
        color: #eeff00;
        font-weight: bold;
        padding-block: 15px;
        margin-top: -20px;
    }

    :deep(.dp__menu) {
        border-radius: 20px;
        border-color: #eeff00;
        font-weight: bold;
        padding-bottom: 20px;
    }

    :deep(.dp__input_icon) {
        top: 32%;
    }
</style>
