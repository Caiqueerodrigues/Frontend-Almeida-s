<template>
    <v-row class="justify-center py-8">
        <v-col cols="12" class="text-center">
            <h2 class="text-secondary">Entradas e Saídas Gerais do Período</h2>
        </v-col>
        <v-col cols="2">
            <div
                class="postit bg-default"
            >
                <p class="text-center">
                    <strong>CORTE:</strong><br>
                </p>
                <p class="text-center text-success">
                    Pedidos Cadastrados: <strong>{{ detailsCategory.length > 0 ? detailsCategory[0].pedidosLancados : 0 }}</strong><br>
                </p>
                <p class="text-center text-blue">
                    Pedidos Pagos: {{ detailsCategory.length > 0 ? detailsCategory[0].pedidosPagos : 0 }}
                </p>
                <p class="text-center text-secondary">
                    Gastos: {{ detailsCategory.length > 0 ? detailsCategory[0].gastos : 0 }}
                </p>
            </div>
        </v-col>
        <v-col cols="2">
            <div
                class="postit bg-default"
            >
                <p class="text-center">
                    <strong>DEBRUAGEM:</strong><br>
                </p>
                <p class="text-center text-success">
                    Pedidos Cadastrados: <strong>{{ detailsCategory.length > 0 ? detailsCategory[1].pedidosLancados : 0 }}</strong><br>
                </p>
                <p class="text-center text-blue">
                    Pedidos Pagos: {{ detailsCategory.length > 0 ? detailsCategory[1].pedidosPagos : 0 }}
                </p>
                <p class="text-center text-secondary">
                    Gastos: {{ detailsCategory.length > 0 ? detailsCategory[1].gastos : 0 }}
                </p>
            </div>
        </v-col>
        <v-col cols="4" class="text-center mt-4 d-flex flex-column align-center justify-center">
            <VueDatePicker 
                class="w-100 mx-auto"
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
            <div class="d-flex w-100 ga-12 mt-4">
                <v-btn 
                    variant="flat" 
                    class="rounded-xl" 
                    color="warning"
                    @click="() => navigateTo('/financeiro')"
                >
                    IR PARA LANÇAMENTOS
                </v-btn>
                <v-btn 
                    variant="flat" 
                    class="rounded-xl" 
                    color="success"
                    @click="() => navigateTo('/pedidos')"
                >
                    IR PARA PEDIDOS
                </v-btn>
            </div>
        </v-col>
        <v-col cols="2">
            <div
                class="postit bg-default"
            >
                <p class="text-center">
                    <strong>DUBLAGEM:</strong><br>
                </p>
                <p class="text-center text-success">
                    Pedidos Cadastrados: <strong>{{ detailsCategory.length > 0 ? detailsCategory[2].pedidosLancados : 0 }}</strong><br>
                </p>
                <p class="text-center text-blue">
                    Pedidos Pagos: {{ detailsCategory.length > 0 ? detailsCategory[2].pedidosPagos : 0 }}
                </p>
                <p class="text-center text-secondary">
                    Gastos: {{ detailsCategory.length > 0 ? detailsCategory[2].gastos : 0 }}
                </p>
            </div>
        </v-col>
        <v-col cols="2">
            <div
                class="postit bg-default"
            >
                <p class="text-center">
                    <strong>GERAIS:</strong><br>
                </p>
                <p class="text-center text-success">
                    Pedidos Cadastrados: <strong>{{ getTotal(detailsCategory.map(item => item.pedidosLancados)) }}</strong><br>
                </p>
                <p class="text-center text-blue">
                    Pedidos Pagos: {{ getTotal(detailsCategory.map(item => item.pedidosPagos)) }}
                </p>
                <p class="text-center text-secondary">
                    Gastos: {{ getTotal(detailsCategory.map(item => item.gastos)) }}
                </p>
            </div>
        </v-col>

        <v-col cols="10" class="container-graph rounded-xl">
            <Charts
                :labels="labels"
                :data="dataBarAReceber"
                type="bar"
                :title="'A Receber do Período R$ ' + (dataBarAReceber.reduce((a, b) => a + b.data.reduce((c, d) => c + d, 0), 0)).toFixed(2)"
            />
        </v-col>
        <v-col cols="10" class="container-graph rounded-xl">
            <Charts
                :labels="labels"
                :data="dataBarRecebimentos"
                type="bar"
                :title="'Recebimentos R$ ' + (dataBarRecebimentos.reduce((a, b) => a + b.data.reduce((c, d) => c + d, 0), 0)).toFixed(2)"
            />
        </v-col>
        <v-col cols="10" class="container-graph rounded-xl">
            <Charts
                :labels="labels"
                :data="dataBar"
                type="bar"
                :title="'Rendimento por Tipo de Serviço R$ ' + (dataBar.reduce((a, b) => a + b.data.reduce((c, d) => c + d, 0), 0)).toFixed(2)"
            />
        </v-col>
        <v-col cols="10" md="5" class="container-graph rounded-xl">
            <Charts
                :labels="labels"
                :data="dataLine"
                type="line"
                :title="'Entradas e Saídas Gerais do Período R$ ' + (dataLine.length === 2 ? (dataLine[0].data.reduce((a, b) => a + b, 0) - dataLine[1].data.reduce((a, b) => a + b, 0)).toFixed(2) : '0.00')"
            />
        </v-col>
        <v-col cols="10" md="5" class="container-graph rounded-xl">
            <Charts
                :labels="[ 'Geral', 'Corte', 'Debruagem', 'Dublagem' ]"
                :data="dataPie"
                type="pie"
                :title="'Gastos por Tipo de Serviço R$ ' + (dataPie.reduce((a, b) => a + b, 0)).toFixed(2)"
            />
        </v-col>
    </v-row>
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import moment from 'moment-timezone';

    const router = useRouter();
    const axios = inject('axios');

    const now = moment().tz('America/Sao_Paulo');
    const firstDay = moment().tz('America/Sao_Paulo').startOf('month');
    const date = ref([firstDay.toDate(), now.toDate()]);
    const minDate = moment('2000-01-01').tz('America/Sao_Paulo').toDate();

    const labels = ref([]);
    const dataLine = ref([]);
    const dataBar = ref ([]);
    const dataBarRecebimentos = ref ([]);
    const dataBarAReceber = ref ([]);
    const dataPie = ref([]);
    const detailsCategory = ref([]);

    const navigateTo = (route) => {
        router.push(route);
    }

    const getDados = async () => {
        const initialDate = moment(date.value[0]).tz('America/Sao_Paulo').format('YYYY-MM-DD');
        const finalDate = moment(date.value[1]).tz('America/Sao_Paulo').format('YYYY-MM-DD');
        
        await axios.get(`finance/${initialDate}/${finalDate}`).then(response => {
            labels.value = response.labels;
            dataBar.value = response.dataBar;
            dataPie.value = response.dataPie;
            dataLine.value = response.dataLine;
            dataBarRecebimentos.value = response.dataPaidBar;
            dataBarAReceber.value = response.dataReceiveBar;
            detailsCategory.value = response.detailsCategory;
        }).catch(error => {
            console.error(error);
        });
    }

    const getTotal = (array) => {
        return array.reduce((a, b) => a + b, 0);
    }

    watch(date, () => {
        getDados();
    });

    onBeforeMount(() => {
        getDados();
    });
</script>
<style scoped>
    .container-graph {
        background-color: #f5f5f5ab;
        margin: 10px;
    }

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

    .postit {
        user-select: none;
        cursor: grab;
        padding: 20px;
        width: 100%;
        min-height: 100px;
        color: #A60014;
        border-radius: 10px;
        font-weight: bold;
        font-weight: bold;
        text-align: center;
        box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
        transition: transform 0.2s;
        background-color: #D96429;
    }

    .postit:active {
        box-shadow: 4px 8px 24px #0003;
    }

    .postit:hover {
        transform: rotate(-2deg) scale(1.05);
    }

    .bg-default {
        background-color: #f5f5f5ab;
    }
</style>
