<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" class="text-center">
            <h2 class="text-center text-secondary">
                LISTAGEM DE PEDIDOS <br>
                {{ textDate }}
            </h2>
        </v-col>
        <v-col cols="12">
            <v-row class="justify-center w-100">
                <v-col cols="12" md="4">
                    <DatePicker 
                        name="dataListagemPedidos"
                        :date="selectedDate"
                        :onlyDate="true"
                        @dateEmit="setDate($event)"
                    />
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" md="7" class="text-center" v-if="pedidos.length > 0">
            <DataTable 
                title="Listagem de Pedidos"
                :items="pedidos"
                :headers="nomesColunas" 
                :acaoVer="true"
                @verId="showFormFunc($event)"
            />
            <span class="text-secondary text-h6 font-weight-bold">TOTAL FATURADO R$ {{ formattePrice(totalFaturado) }}</span>
        </v-col>
        <v-col cols="12" v-if="pedidos.length === 0">
            <h1 class="text-center text-secondary">
                Não existem pedidos <br> para a data selecionada
            </h1>
        </v-col>
        <v-col cols="12" class="text-center z-1">
            <v-btn variant="flat" class="rounded-xl" color="success" @click="showFormFunc()">
                CADASTRAR PEDIDO
            </v-btn>
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject("axios");
    const formattePrice = inject("formattePrice");
    const formatteDateDB = inject("formatteDateDB");

    const router = useRouter();

    const nomesColunas = ref([
        { title: 'Cliente', align: 'center', key: 'nomeCliente' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
        { title: 'Ação', align: 'center', key: 'ver' },
    ]);
    const textDate = ref("");
    const pedidos = ref([]);
    const totalFaturado = ref(0);
    const selectedDate = ref(new Date());

    const getPedidos = async () => {
        let date = new Date(selectedDate.value);
        const dateFormatted = formatteDateDB(date);
        const dados = { date: dateFormatted };
        
        await axios.post('/orders/date', dados).then(response => {
            totalFaturado.value = 0;
            if(response.length > 0) {
                response.forEach(item => {
                    item.nomeCliente = item.client.nome;
                    totalFaturado.value += item.totalDinheiro;
                });
                pedidos.value = response;
            } else {
                totalFaturado.value = 0;
                pedidos.value = [];
            }
        }).catch(err => console.error(err));
    }

    const showFormFunc = (ev = 0) => {
        router.push(`/pedido/${ev}`);
    };

    const setDate = (ev) => {
        const date = new Date(ev);
        selectedDate.value = date;
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

    watch(() => selectedDate.value, (nv) => {
        if(nv) {
            textDate.value = getDateAtualBrasilia(nv); 
            getPedidos();
        }
    });
    
    onMounted(() => {
        getPedidos();
        textDate.value = getDateAtualBrasilia();
    });
</script>
<style scoped>
    .z-1 {
        z-index: 1 !important;
    }

    .z-2 {
        z-index: 2 !important;
    }
</style>