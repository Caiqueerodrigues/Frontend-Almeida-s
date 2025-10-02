<template>
    <v-row class="justify-center ga-4 py-8">
        <v-col cols="12" class="text-center">
            <h2 class="text-secondary">Entradas e Saídas Gerais do Período</h2>
        </v-col>
        <v-col cols="12" class="text-center">
            <VueDatePicker 
                class="w-50 mx-auto"
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
        <v-col cols="12" class="d-flex ga-3 justify-center">
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
                :labels="[ 'Corte', 'Debruagem', 'Dublagem' ]"
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

    const router = useRouter();
    const axios = inject('axios');

    const date = ref([new Date(), new Date()]);

    const labels = ref([]);
    const dataLine = ref([]);
    const dataBar = ref ([]);
    const dataPie = ref([]);

    const navigateTo = (route) => {
        router.push(route);
    }

    const getDados = async () => {
        const initialDate = date.value[0].toISOString().split("T")[0];
        const finalDate = date.value[1].toISOString().split("T")[0];

        await axios.get(`finance/${initialDate}/${finalDate}`).then(response => {
            labels.value = response.labels;
            dataBar.value = response.dataBar;
            dataPie.value = response.dataPie;
            dataLine.value = response.dataLine;
        }).catch(error => {
            console.error(error);
        });
    }

    watch(date, () => {
        getDados();
    });

    onBeforeMount(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        date.value = [firstDay, now];
    });
</script>
<style scoped>
    .container-graph {
        background-color: #f5f5f5ab;
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
</style>
