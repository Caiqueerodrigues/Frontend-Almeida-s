<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" class="text-center pt-4">
            <h2 class="text-center text-secondary">
                LISTAGEM DE PEDIDOS  {{ naoEntregues ? 'NÃO ENTREGUES DE ' : '' }}<br>
                {{ devidos ? ' DEVIDOS' : naoEntregues ? clienteSelecionado : textDate }}
            </h2>
        </v-col>
        <v-col cols="12" v-if="!naoEntregues">
            <v-row class="justify-center w-100">
                <v-col cols="12" class="text-center" v-if="pedidos.length > 0">
                    <span v-if="!devidos" class="text-secondary text-h6 font-weight-bold">
                        TOTAL FATURADO R$ {{ formattePrice(totalReceber) }}
                    </span>
                    <span v-if="devidos" class="text-secondary text-h6 font-weight-bold">
                        TOTAL SELECIONADO PARA BAIXA R$ {{ formattePrice(totalDevido) }}
                    </span><br>
                    <span v-if="devidos" class="text-secondary text-h6 font-weight-bold">
                        {{ pedidosFiltrados.length }} PEDIDOS DEVIDOS 
                    </span><br>
                    <span v-if="devidos" class="text-secondary text-h6 font-weight-bold">
                        R$ {{ formattePrice(totalReceber) }} A RECEBER
                    </span>
                </v-col>
                <v-col cols="12" md="4" v-if="!devidos">
                    <DatePicker 
                        name="dataListagemPedidos"
                        :date="selectedDate"
                        :onlyDate="true"
                        @dateEmit="setDate($event)"
                    />
                </v-col>
                <v-col cols="12" md="4">
                    <v-select
                        chips
                        class="w-75 mx-auto"
                        label="Cliente"
                        v-model="filterClient"
                        :items="clientes"
                        variant="outlined"
                        rounded="xl"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                    <v-select
                        chips
                        class="w-75 mx-auto"
                        label="Tipo de Serviço"
                        v-model="filterService"
                        :items="[ 'Todos', 'Corte', 'Debruagem', 'Dublagem' ]"
                        variant="outlined"
                        rounded="xl"
                    ></v-select>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" v-if="pedidos.length === 0 ">
            <h1 class="text-center text-secondary" v-if="!naoEntregues">
                Não existem pedidos <br> {{ devidos ? '' : 'para a data selecionada'  }}
            </h1>

            <h1 class="text-center text-secondary" v-if="naoEntregues">
                Não existem Não entregues para este cliente!
            </h1>
        </v-col>
        <v-col cols="12" class="text-center z-1">
            <v-btn 
                variant="flat" 
                class="rounded-xl mt-2" 
                color="success" 
                @click="showFormFunc()"
                v-if="!devidos && !naoEntregues"
            >
                CADASTRAR PEDIDO
            </v-btn>
            <v-btn 
                variant="flat"
                class="rounded-xl ml-4 mt-2" 
                color="success" 
                @click="impressao()" 
                :disabled="selectedsPrint.length === 0"
                v-if="!devidos"
            >
                IMPRESSÃO FICHAS {{ selectedsPrint.length > 0 ? '- (' + selectedsPrint.length  + ')' : '' }}
            </v-btn>
            <v-btn 
                variant="flat"
                class="rounded-xl ml-4 mt-2" 
                :color="devidos || naoEntregues ? 'success' : 'warning'" 
                @click="devidos || naoEntregues ? getPedidos() : getPendentes()"
            >
                {{ devidos || naoEntregues ? 'BUSCAR PEDIDOS' : 'BUSCAR PENDENTE(S)' }}
            </v-btn>
            <v-btn 
                v-if="!devidos"
                variant="flat"
                class="rounded-xl ml-4 mt-2" 
                color="warning"
                @click="getClientes()"
            >
                BUSCAR NÃO ENTEGUES(S)
            </v-btn>
            <v-btn 
                variant="flat"
                class="rounded-xl ml-4 mr-2" 
                color="warning" 
                :disabled="selectedsPrint.length === 0"
                @click="showModalDate = true"
                v-if="devidos"
            >
                MARCAR COMO PAGO(S) {{ selectedsPrint.length > 0 ? '- (' + selectedsPrint.length  + ')' : '' }}
            </v-btn>
            <v-btn 
                variant="flat"
                class="rounded-xl ml-4 mt-2" 
                color="success" 
                :disabled="selectedsPrint.length === 0"
                @click="showModal = true"
            >
                MARCAR COMO RETIRADO(S) {{ selectedsPrint.length > 0 ? '- (' + selectedsPrint.length  + ')' : '' }}
            </v-btn>
        </v-col>
        <v-col cols="12" class="text-center pb-12" v-if="pedidos.length > 0 && showTable">
            <DataTable 
                :title="'Listagem de Pedidos ' + pedidosFiltrados.length"
                :items="pedidosFiltrados"
                :headers="nomesColunas" 
                :acaoVer="true"
                :redirect="true"
                @verId="showFormFunc($event)"
                @selecteds="setSelecteds($event)"
            />
        </v-col>
    </v-row>

    <v-row v-if="showModal">
        <v-col cols="12">
            <v-dialog 
                max-width="50%" 
                height="95%" 
                v-model="showModal"
                persistent
            >
                <v-card
                    class="text-surface bg-primary text-center "
                    prepend-icon="mdi-border-color"
                    :title="`Buscar pedido(s)não entregue(s) por cliente`"
                >
                    <template #append>
                        <v-icon
                            @click="closeModal()"
                            size="30"
                        >
                            mdi-close
                        </v-icon>
                    </template>
                    <v-card-text class="px-0 pb-0">
                        <v-divider :thickness="4" color="white" />
                        <v-form ref="formPagos">
                            <v-row class="justify-center">
                                <v-col cols="10" class="mt-4">
                                    <v-text-field
                                        v-capitalize-first
                                        rounded="xl"
                                        label="Quem retirou"
                                        v-model="baixaVarios.quemRetirou"
                                        type="text"
                                        variant="outlined"
                                        :rules="[ (value) => !!value || 'O campo é obrigatório!']"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="px-0 pt-2">
                                    <DatePicker 
                                        name="dataRetirada"
                                        :date="selectedDate"
                                        :onlyDate="true"
                                        @dateEmit="baixaVarios.dataRetirada = $event"
                                    />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <template v-slot:actions>
                        <v-col cols="12">
                            <v-btn
                                class="bg-primary text-white font-weight-bold rounded-xl mr-4"
                                size="large"
                                variant="outlined"
                                @click="closeModal()"
                            >
                                CANCELAR
                            </v-btn>
                            <v-btn
                                class="bg-success text-primary font-weight-bold rounded-xl"
                                size="large"
                                variant="outlined"
                                @click="marcarRetirados()"
                                :disabled="!baixaVarios.quemRetirou"
                            >
                                SALVAR
                            </v-btn>
                        </v-col>
                    </template>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <ModalDate 
        :isActiveModal="showModalDate"
        @setInactiveModal="showModalDate = $event"
        @confirma="marcarPagos($event)"
    />

    <v-row v-if="showModalRetirados">
        <v-col cols="12">
            <v-dialog 
                max-width="30%" 
                height="40%" 
                v-model="showModalRetirados"
                persistent
            >
                <v-card
                    class="text-surface bg-primary text-center "
                    prepend-icon="mdi-border-color"
                    :title="`Buscar pedidos não retirado(s)`"
                >
                    <template #append>
                        <v-icon
                            @click="showModalRetirados = false, clienteSelecionado = null"
                            size="30"
                        >
                            mdi-close
                        </v-icon>
                    </template>
                    <v-card-text class="px-0 pb-0">
                        <v-divider :thickness="4" color="white" />
                        <v-form ref="formPagos">
                            <v-row class="justify-center">
                                <v-col cols="11" class="mt-4">
                                    <v-select
                                        chips
                                        class="w-100 mx-auto"
                                        label="Selecione o cliente para buscar"
                                        v-model="clienteSelecionado"
                                        :items="clientsNames"
                                        variant="outlined"
                                        rounded="xl"
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <template v-slot:actions>
                        <v-row class="justify-center mb-4">
                            <v-col cols="6" class="text-right">
                                <v-btn
                                    class="bg-primary text-white font-weight-bold rounded-xl mr-4"
                                    size="large"
                                    variant="outlined"
                                    @click="showModalRetirados = false, clienteSelecionado = null"
                                >
                                    CANCELAR
                                </v-btn>
                            </v-col>
                            <v-col cols="6" class="text-left">
                                <v-btn
                                    class="bg-success text-primary font-weight-bold rounded-xl px-6 py-2"
                                    size="large"
                                    variant="outlined"
                                    :disabled="!clienteSelecionado"
                                    @click="getNaoEntegues()"
                                >
                                    BUSCAR
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject("axios");
    const loading = inject("loading");
    const formattePrice = inject("formattePrice");
    const formatteDateDB = inject("formatteDateDB");
    const selectedsPrint = ref([]);
    const showModalDate = ref(false);
    const showModalRetirados = ref(false);

    const router = useRouter();

    const formPagos = ref(null);
    const nomesColunas = ref([
        { title: ' ', align: 'center', key: 'checkbox', maxWidth: '50px' },
        { title: 'ID pedido', align: 'center', key: 'id', maxWidth: '100px' },
        { title: 'Cliente', align: 'center', key: 'nomeCliente' },
        { title: 'Total', align: 'center', key: 'totalDinheiro' },
        { title: 'Hora pedido', align: 'center', key: 'dataPedido', maxWidth: '120px' },
        { title: 'Modelo', align: 'center', key: 'modelo.tipo', maxWidth: '280px' },
        { title: 'Rend.', align: 'center', key: 'modelo.rendimento', maxWidth: '80px' },
        { title: 'Cor(es)', align: 'center', key: 'cor', maxWidth: '180px' },
        { title: 'Preço par', align: 'center', key: 'modelo.preco' },
        { title: 'Total pares', align: 'center', key: 'totalPares', maxWidth: '80px' },
        { title: 'Obs.', align: 'center', key: 'obs', maxWidth: '250px' },
        { title: 'Quem concluiu', align: 'center', key: 'quemCortou', maxWidth: '80px' },
        { title: 'Quem retirou', align: 'center', key: 'quemAssinou' },
        { title: 'Pago?', align: 'center', key: 'jaFoiPago', maxWidth: '80px' },
    ]);
    const textDate = ref("");
    const pedidos = ref([]);
    const totalDevido = ref(0);
    const selectedDate = ref(new Date());
    const devidos = ref(false);
    const naoEntregues = ref(false);
    const showTable = ref(true);
    const showModal = ref(false);
    const baixaVarios = ref({ quemRetirou: '', dataRetirada: selectedDate.value, ids: [] });
    const filterClient = ref('Todos');
    const clients = ref(null);
    const clientsNames = ref([]);
    const clienteSelecionado = ref(null)
    const filterService = ref('Todos')

    const getPedidos = async () => {
        devidos.value = false;
        naoEntregues.value = false;
        clienteSelecionado.value = null;
        filterClient.value = 'Todos';
        filterService.value = 'Todos';
        selectedsPrint.value = [];
        let date = new Date(selectedDate.value);
        const dateFormatted = formatteDateDB(date);
        const dados = { date: dateFormatted };
        
        await axios.post('/orders/date', dados).then(response => {
            if(response.length > 0) {
                response.forEach(item => {
                    item.nomeCliente = item.client.nome;
                });
                pedidos.value = response;
            } else {
                pedidos.value = [];
            }
            resetCheckeds();
        }).catch(err => console.error(err));
    }

    const getClientes = async () => {
        if(clients.value) {
            showModalRetirados.value = true;
            return;
        }
        await axios.get('clients').then(response => {
            if(response.length > 0) {
                clients.value = response;
                clientsNames.value = response.map(item => item.nome);
                clientsNames.value = [ 'Todos', ...clientsNames.value ];
                showModalRetirados.value = true;
            }
        }).catch(err => console.error(err));
    }

    const marcarPagos = async (date) => {
        showModalDate.value = false;
        
        const dados = { 
            ids: selectedsPrint.value,
            date: formatteDateDB(date)
        }
        
        await axios.put('/orders/updatePayment', dados).then(response => {
            devidos.value = false;
            getPedidos();
            resetCheckeds();
        }).catch(err => console.error(err));
    }

    const marcarRetirados = async () => {
        baixaVarios.value.dataRetirada = formatteDateDB(new Date(baixaVarios.value.dataRetirada));
        baixaVarios.value.ids = selectedsPrint.value;

        axios.put('/orders/withdrawn', baixaVarios.value).then(response => {
            closeModal();
            if(devidos.value) getPendentes();
            else if(naoEntregues.value) getNaoEntegues();
            else getPedidos();
            resetCheckeds();
        }).catch(err => console.error(err));
    } 

    const closeModal = () => {
        resetCheckeds();
        showModal.value = false;
        baixaVarios.value = { ids: [], date: selectedDate.value, quemRetirou: '' };
    }

    const getPendentes = async () => {
        devidos.value = true;
        naoEntregues.value = false;
        filterClient.value = 'Todos';
        filterService.value = 'Todos';
        
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

    const getNaoEntegues = async () => {
        naoEntregues.value = true;
        const idClient = clienteSelecionado.value !== 'Todos' ?
            clients.value.find(item => item.nome === clienteSelecionado.value)?.id :
            "Todos";
        showModalRetirados.value = false;
        
        await axios.get(`/orders/undelivered/${idClient}`).then(response => {
            if(response.length > 0) {
                response.forEach(item => {
                    item.nomeCliente = item.client.nome;
                });
                pedidos.value = response;
            } else pedidos.value = [];
            showModalRetirados.value = false;
            resetCheckeds();
        }).catch(err => console.error(err));
    }

    const clientes = computed(() => {
        const nomes = ['Todos'];
        pedidos.value.map(item => {
            if(!nomes.includes(item.client.nome)) nomes.push(item.client.nome)
        })
        return nomes;
    });

    const pedidosFiltrados = computed(() => {
        resetCheckeds();
        if (!filterClient.value || filterClient.value === "Todos" && filterService.value === 'Todos') return pedidos.value;

        let pedidosSelecionados = [];

        if (filterService.value !== 'Todos') {
            if(filterService.value !== 'Corte') {
                pedidosSelecionados = pedidos.value.filter(pedido =>
                    pedido.modelo?.tipo.toLowerCase().includes(filterService.value.toLowerCase())
                );
            } else {
                pedidosSelecionados = pedidos.value.filter(pedido =>
                    !pedido.modelo?.tipo.toLowerCase().includes('dublagem') && !pedido.modelo?.tipo.toLowerCase().includes('debruagem')
                );
            }
        }

        if (filterClient.value && filterClient.value !== "Todos") {
            pedidosSelecionados = pedidosSelecionados.length > 0 ? 
                pedidosSelecionados.filter(pedido => pedido.client?.nome === filterClient.value) : 
                pedidos.value.filter(pedido => pedido.client?.nome === filterClient.value);
        }

        return pedidosSelecionados;
    });

    const totalReceber = computed(() => {
        return pedidosFiltrados.value.reduce((acc , item) => acc + item.totalDinheiro, 0);
    });

    const resetCheckeds = () => {
        selectedsPrint.value = [];
        showTable.value = false;
        setTimeout(() => {
            showTable.value = true
        }, 100);
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

    const setSelecteds = (ev) => {
        selectedsPrint.value = ev;
        if(devidos.value) {
            totalDevido.value = 0;
            const pedidosDevidosSelecionados = pedidos.value.filter(item => selectedsPrint.value.includes(item.id));
            totalDevido.value += pedidosDevidosSelecionados.reduce((acc, item) => acc + item.totalDinheiro, 0);
        }
    }

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
