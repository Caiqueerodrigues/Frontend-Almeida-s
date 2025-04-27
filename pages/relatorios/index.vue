<template>
    <v-row class="h-100 justify-center align-center mb-4">
        <v-col cols="12" class="mt-4 text-center">
            <span CLASS="text-center text-h5 font-weight-bold text-secondary">
                SELECIONE O DIA OU PERÍODO
            </span>
        </v-col>
        <v-col cols="12" md="7" v-if="!loading">
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
        <v-col cols="12" class="text-center" v-if="!loading && pedidos.length  > 0">
            <DataTable
                title="Listagem de pedidos"
                :items="pedidos"
                :headers="nomesColunas"
                :acaoVer="true"
                :redirect="true"
                class="mb-2"
            />
            <span class="text-h5 text-secondary font-weight-bold">
                Total Faturado no período é R$ {{ total }}
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
        <v-col col="12" class="text-center">
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
    const total = ref(0);
    const nomesColunas = ref([
        { title: 'Nome', align: 'center', key: 'nome' },
        { title: 'Dia', align: 'center', key: 'dia' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
    ]);
    const dataChart = ref({ labels: [], data: [] });
    const showModalRelatorios = ref(false);

    const getPedidos = async () => {
        const initialDate = formatteDateDB(date.value[0]).split("T")[0];
        const finalDate = formatteDateDB(date.value[1]).split("T")[0];

        await axios.get(`/orders/period/${initialDate}/${finalDate}`).then(response => {
            pedidos.value = [];
            total.value = 0;

            if(response.length > 0) {
                response.map(item => {
                    const date = item.dataPedido.split('T')[0];
                    const [ ano, mes , dia ] = date.split("-");

                    const indexExists = dataChart.value.labels.findIndex(label => label === item.client.nome.split(" ")[0]) 
                    if(indexExists === -1) {
                        dataChart.value.labels.push(`${item.client.nome.split(" ")[0]}`);
                        dataChart.value.data.push(item.totalDinheiro);
                    } else {
                        dataChart.value.data[indexExists] += item.totalDinheiro;
                    }

                    pedidos.value.push(
                        { totalDinheiro: item.totalDinheiro, dia: `${dia}-${mes}-${ano}` , nome: item.client.nome, id: item.id  }
                    );
                });
                total.value = Number(pedidos.value.reduce((total, item) => total += item.totalDinheiro, 0)).toFixed(3);
            }
        }).catch(e => console.error(e));
    }

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
    }

    :deep(.dp__menu) {
        border-radius: 20px;
        border-color: #eeff00;
        font-weight: bold;
        padding-bottom: 20px;
    }
</style>