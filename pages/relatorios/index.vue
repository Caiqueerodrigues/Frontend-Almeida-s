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
        <v-col cols="4" md="4" v-if="!loading">
            <VueDatePicker 
                v-model="date" 
                range 
                autoApply
                locale="pt-BR"
                dark
                format="dd/MM/yyyy"
                :clearable="false"
                :min-date="new Date('2000-01-01')"
                :max-date="new Date()"
            />
        </v-col>
        <v-col cols="4" md="4">
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
        <v-col cols="12" class="text-center" v-if="!loading && pedidos.length  > 0">
            <DataTable
                :title="'Listagem de pedidos ' + pedidosFiltrados.length"
                :items="pedidosFiltrados"
                :headers="nomesColunas"
                :acaoVer="true"
                :redirect="true"
                class="mb-2"
            />
            <span class="text-h5 text-secondary font-weight-bold">
                Total Faturado no período é R$ {{ totalReceber }}
            </span>
            <Charts 
                :labels="dataChart.labels"
                :data="dataChart.data"
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

    const axios = inject("axios");
    const loading = inject("loading");
    const formatteDateDB = inject("formatteDateDB");
    const date = ref([new Date(), new Date()]);
    const pedidos = ref([]);
    const nomesColunas = ref([
        { title: 'ID pedido', align: 'center', key: 'id' },
        { title: 'Nome', align: 'center', key: 'nome' },
        { title: 'Dia', align: 'center', key: 'dia' },
        { title: 'Modelo', align: 'center', key: 'modelo.tipo' },
        { title: 'Rendimento', align: 'center', key: 'modelo.rendimento' },
        { title: 'Cor(es)', align: 'center', key: 'cor' },
        { title: 'Total de pares', align: 'center', key: 'totalPares' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
        { title: 'Pago?', align: 'center', key: 'jaFoiPago' },
        { title: 'Quem cortou', align: 'center', key: 'quemCortou' },
        { title: 'Quem retirou', align: 'center', key: 'quemAssinou' },
        { title: 'Observação', align: 'center', key: 'obs', maxWidth: '250px' },
    ]);
    const showModalRelatorios = ref(false);
    const filter = ref({ client: 'Todos', situation: 'Todos' });

    const getPedidos = async () => {
        const initialDate = formatteDateDB(date.value[0]).split("T")[0];
        const finalDate = formatteDateDB(date.value[1]).split("T")[0];
        filter.value.client = "Todos";
        filter.value.situation = "Todos";

        await axios.get(`/orders/period/${initialDate}/${finalDate}`).then(response => {
            pedidos.value = [];

            if(response.length > 0) {
                response.map(item => {
                    const date = item.dataPedido.split('T')[0];
                    const [ ano, mes , dia ] = date.split("-");

                    pedidos.value.push(
                        { ...item, totalDinheiro: item.totalDinheiro, dia: `${dia}-${mes}-${ano}` , nome: item.client.nome, id: item.id  }
                    );
                });
            }
        }).catch(e => console.error(e));
    }

    const dataChart = computed(() => {
        const labels = [];
        const data = [];
        const nomesIndex = {};
        
        pedidosFiltrados.value.forEach(item => {
            const nomeCliente = item.client?.nome || "Desconhecido";
            
            if (nomesIndex[nomeCliente] !== undefined) {
                data[nomesIndex[nomeCliente]] += item.totalDinheiro;
            } else {
                nomesIndex[nomeCliente] = labels.length;
                labels.push(nomeCliente);
                data.push(item.totalDinheiro);
            }
        });

        return {
            labels,
            data
        };
    })

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
        return filtrados
    });

    const totalReceber = computed(() => {
        return pedidosFiltrados.value.reduce((acc , item) => acc + item.totalDinheiro, 0);
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