<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" class="text-center">
            <h2 class="text-center text-secondary">
                LISTAGEM DE PEDIDOS <br>
                {{ devidos ? ' DEVIDOS' : textDate }}
            </h2>
        </v-col>
        <v-col cols="12" v-if="!devidos">
            <v-row class="justify-center w-100">
                <v-col cols="12" class="text-center" v-if="pedidos.length > 0">
                    <span class="text-secondary text-h6 font-weight-bold">TOTAL FATURADO R$ {{ formattePrice(totalFaturado) }}</span>
                </v-col>
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
        <v-col cols="12" v-if="pedidos.length === 0">
            <h1 class="text-center text-secondary">
                Não existem pedidos <br> {{ devidos ? '' : 'para a data selecionada'  }}
            </h1>
        </v-col>
        <v-col cols="12" class="text-center z-1">
            <v-btn 
                variant="flat" 
                class="rounded-xl" 
                color="success" 
                @click="showFormFunc()"
                v-if="!devidos"
            >
                CADASTRAR PEDIDO
            </v-btn>
            <v-btn 
                variant="flat"
                class="rounded-xl ml-4" 
                color="success" 
                @click="impressao()" 
                :disabled="selectedsPrint.length === 0"
                v-if="!devidos"
            >
                IMPRESSÃO FICHAS
            </v-btn>
            <v-btn 
                variant="flat"
                class="rounded-xl ml-4" 
                :color="devidos ? 'success' : 'warning'" 
                @click="devidos ? getPedidos() : getPendentes()"
            >
                {{ devidos ? 'BUSCAR PEDIDOS' : 'BUSCAR PENDENTE(S)' }}
            </v-btn>
            <v-btn 
                variant="flat"
                class="rounded-xl ml-4" 
                color="warning" 
                :disabled="selectedsPrint.length === 0"
                @click="marcarPagos()"
                v-if="devidos"
            >
                MARCAR COMO PAGO(S)
            </v-btn>
        </v-col>
        <v-col cols="12" class="text-center pb-12" v-if="pedidos.length > 0 && showTable">
            <DataTable 
                title="Listagem de Pedidos"
                :items="pedidos"
                :headers="nomesColunas" 
                :acaoVer="true"
                @verId="showFormFunc($event)"
                @selecteds="selectedsPrint = $event"
            />
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject("axios");
    const loading = inject("loading");
    const formattePrice = inject("formattePrice");
    const formatteDateDB = inject("formatteDateDB");
    const selectedsPrint = ref([]);

    const router = useRouter();

    const nomesColunas = ref([
        { title: ' ', align: 'center', key: 'checkbox', width: '10px' },
        { title: 'Cliente', align: 'center', key: 'nomeCliente', width: '30px' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
        { title: 'Hora pedido', align: 'center', key: 'dataPedido' },
        { title: 'Modelo', align: 'center', key: 'modelo.tipo' },
        { title: 'Cor(es)', align: 'center', key: 'cor' },
        { title: 'Preço par', align: 'center', key: 'modelo.preco' },
        { title: 'Total pares', align: 'center', key: 'totalPares' },
        { title: 'Obs.', align: 'center', key: 'obs' },
        { title: 'Quem cortou', align: 'center', key: 'quemCortou' },
        { title: 'Quem retirou', align: 'center', key: 'quemAssinou' },
        { title: 'Pago?', align: 'center', key: 'jaFoiPago' },
        { title: 'Ação', align: 'center', key: 'ver' },
    ]);
    const textDate = ref("");
    const pedidos = ref([]);
    const totalFaturado = ref(0);
    const selectedDate = ref(new Date());
    const devidos = ref(false);
    const showTable = ref(true);

    const getPedidos = async () => {
        devidos.value = false;
        selectedsPrint.value = [];
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
            resetCheckeds();
        }).catch(err => console.error(err));
    }

    const marcarPagos = async () => {
        devidos.value = false;
        
        const dados = { 
            ids: selectedsPrint.value,
            date: formatteDateDB(new Date())
        }

        await axios.put('/orders/updatePayment', dados).then(response => {
            getPedidos();
            resetCheckeds();
        }).catch(err => console.error(err));
    }

    const getPendentes = async () => {
        devidos.value = true;
        
        await axios.get('/orders/due').then(response => {
            selectedsPrint.value = [];
            if(response.length > 0) {
                response.forEach(item => {
                    item.nomeCliente = item.client.nome;
                });
                pedidos.value = response;
            } else pedidos.value = [];
            resetCheckeds();
        }).catch(err => console.error(err));
    }

    const resetCheckeds = () => {
        showTable.value = false;
        setTimeout(() => {
            showTable.value = true
        }, 500);
    }

    const showFormFunc = (ev = 0) => {
        router.push(`/pedido/${ev}${ev === 0 ? '?date=' + selectedDate.value.toISOString() : ''}`);
    };

    const impressao = async () => {
        const dados = {
            firstFilter: "CLIENTE",
            client: 0,
            period: [],
            report: "FICHAS_GERAIS",
            situation: "TODOS",
            idPedidos: selectedsPrint.value,
            quantidadeVias: 1,
        }
        await axios.post('report/generate', dados).then(response => {
            const base64 = response;

            const byteCharacters = atob(base64);
            const byteArray = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const printWindow = window.open(blobUrl);
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                };
            }
            resetCheckeds();
        }).catch(e => console.error(e));
    }

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
            selectedsPrint.value = [];
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
<style scoped>
    .z-1 {
        z-index: 1 !important;
    }

    .z-2 {
        z-index: 2 !important;
    }
</style>
