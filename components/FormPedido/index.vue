<template>
    <v-form ref="form">
        <v-row class="justify-center py-4">
            <v-col cols="12">
                <h2 class="text-center text-secondary pt-3">
                    {{ props.id > 0 ? "EDITAR O " : "CADASTRAR UM NOVO " }} PEDIDO
                </h2>
            </v-col>
            <v-col cols="12" md="7" class="text-secondary">
                <v-autocomplete
                    v-model="clientSelected"
                    clearable
                    label="Selecione o cliente"
                    :items="clientsNames"
                    name="cliente"
                    variant="outlined"
                    rounded="xl"
                    :disabled="pedido.modelo !== null"
                    prepend-inner-icon="mdi-account-tie"
                ></v-autocomplete>
            </v-col>
            <v-col cols="12" class="text-secondary" v-show="!loading && pedido.client">
                <h2 class="text-center text-secondary" v-if="modelos.length === 0">Não existem produtos para este cliente</h2>
                <DataTable
                    v-show="pedido.client && modelos.length > 0"
                    title="Listagem de modelos"
                    :items="modelos"
                    :headers="nomesColunas"
                    :acaoVer="false"
                    @verId="pedido.modelo = $event"
                />
            </v-col>
            <v-col cols="12" md="7" v-if="!loading && pedido.modelo">
                <v-row class="justify-center" v-if="dateSelected">
                    <v-col col="12" md="6">
                        <DatePicker 
                            :range="false"
                            title="DATA DE INÍCIO"
                            :date="pedido.dataPedido"
                            name="dataPedido"
                            @dateEmit="pedido.dataPedido = $event"
                        />
                    </v-col>
                    <v-col cols="12" md="6" v-if="dateSelected">
                        <DatePicker 
                            :range="false"
                            title="CONCLUSÃO"
                            name="dataConclusao"
                            :date="pedido.dataFinalizado"
                            :clearable="true"
                            @dateEmit="pedido.dataFinalizado = $event"
                        />
                    </v-col>
                    <v-col cols="12">
                        <DatePicker 
                            :range="false"
                            title="DATA DO PAGAMENTO"
                            :clearable="true"
                            :date="pedido.dataPagamento"
                            name="dataPagamento"
                            @dateEmit="pedido.dataPagamento = $event"
                        />
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="7">
                <v-row class="justify-center" v-if="!loading && pedido.modelo">
                    <v-col cols="12" md="6">
                        <v-text-field
                            rounded="xl"
                            label="Total de pares"
                            v-model="pedido.totalPares"
                            type="number"
                            variant="outlined"
                            :rules="[ (value) => !!value || 'O total de pares é obrigatório!' ]"
                            @input="formateddPrice($event), calculateTotal()"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            rounded="xl"
                            label="Total do pedido"
                            v-model="pedido.totalDinheiro"
                            type="number"
                            variant="outlined"
                            :rules="[(value) => !!value || 'O total é obrigatório!']"
                            @input="formateddPrice($event)"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="7" v-show="pedido.modelo">
                <v-text-field
                    rounded="xl"
                    label="Referência do calçado"
                    v-model="pedido.relatorioCliente"
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col cols="12" v-if="!loading && pedido.totalPares > 0">
                <h2 class="text-center text-secondary">
                    GRADE DO PEDIDO
                </h2>
            </v-col>
            <v-col 
                col="6" 
                md="4" 
                v-for="(item, index) in pedido.grade" 
                :key="index"
                class="d-flex justify-center"
            >
                <CardGradePedido 
                    :item="item"
                    :index="index"
                    @salvar="setNewValor($event)"
                    @add="addNewItemGrade($event)"
                    @remove="removeItemGrade($event)"
                />
            </v-col>
            <v-col 
                col="6" 
                md="4" 
                class="d-flex justify-center"
                v-if="!loading && pedido.totalPares > 0"
            >
                <CardGradePedido 
                    :plus="true"
                    @add="addNewItemGrade($event)"
                />
            </v-col>
            <v-col cols="12" v-if="!loading && pedido.modelo">
                <v-row class="ma-0 pa-0 justify-center">
                    <v-col cols="12" md="7" class="ma-0 pa-0">
                        <AutoCompleteMultiple 
                            v-if="materiais.length > 0"
                            :label="'Materiais recebidos'"
                            :items="materiais"
                            :selecteds="pedido.tipoRecebido"
                            :disabled="false"
                            :outsideList="false"
                            @salvar="pedido.tipoRecebido = $event"
                        />
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="7" v-if="!loading && pedido.tipoRecebido.length > 0" >
                <AutoCompleteMultiple 
                    v-if="materiais.length > 0"
                    :label="'Metragens recebidas'"
                    :items="[]"
                    :selecteds="pedido.metragemRecebido"
                    :disabled="false"
                    :outsideList="true"
                    :type="'number'"
                    :maxLength="pedido.tipoRecebido.length"
                    @salvar="pedido.metragemRecebido = $event"
                />
            </v-col>
            <v-col cols="12" md="7" v-if="!loading && pedido.tipoRecebido.length > 0">
                <AutoCompleteMultiple 
                    v-if="pedido.tipoRecebido.length > 0"
                    :label="'Metragens utilizadas'"
                    :items="[]"
                    :type="'number'"
                    :selecteds="pedido.metragemFinalizado"
                    :disabled="false"
                    :outsideList="true"
                    :maxLength="pedido.tipoRecebido.length"
                    @salvar="pedido.metragemFinalizado = $event"
                />
            </v-col>
            <v-col cols="12" md="7" v-if="!loading && pedido.tipoRecebido.length > 0" >
                <AutoCompleteMultiple 
                    v-if="materiais.length > 0"
                    :label="'Cores dos materiais'"
                    :items="[]"
                    :selecteds="pedido.cor"
                    :disabled="false"
                    :outsideList="true"
                    :type="'text'"
                    :maxLength="pedido.tipoRecebido.length"
                    @salvar="pedido.cor = $event"
                />
            </v-col>
            <v-col cols="12" md="7" v-if="!loading && pedido.tipoRecebido.length > 0">
                <AutoCompleteMultiple 
                    v-if="pedido.tipoRecebido.length > 0"
                    :label="'Rendimento por pares'"
                    :items="[]"
                    :selecteds="pedido.rendimentoParesMetro"
                    :disabled="true"
                />
            </v-col>
            <v-col cols="12" md="7" v-show="pedido.modelo">
                <v-textarea
                    v-model="pedido.obs"
                    rounded="xl"
                    rows="4"
                    variant="outlined"
                    auto-grow
                    label="Observação"
                    counter
                    cleareble
                    maxlength="255"
                ></v-textarea>
            </v-col>
            <v-col cols="12" md="7" v-show="pedido.modelo">
                <v-text-field
                    rounded="xl"
                    label="Quem retirou/Assinou"
                    v-model="pedido.quemAssinou"
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="mt-n6" v-if="pedido.modelo">
                <DatePicker 
                    :range="false"
                    title="DATA DE RETIRADA"
                    name="dataRetirada"
                    :date="pedido.dataRetirada"
                    :clearable="true"
                    @dateEmit="pedido.dataRetirada = $event"
                />
            </v-col>
            <v-col cols="12" class="text-center">
                <v-btn
                    variant="outlined"
                    rounded="xl"
                    class="mr-4"
                    @click="voltar()"
                >
                    VOLTAR
                </v-btn>
                <v-btn
                    variant="outlined"
                    color="success"
                    rounded="xl"
                    class="mr-4"
                    @click="showModalReport = true"
                    :disabled="!props.id || props.id === '0'"
                    :loading="loading"
                >
                    IMPRIMIR
                </v-btn>
                <v-btn
                    variant="flat"
                    color="success"
                    rounded="xl"
                    @click="validateForm()"
                    :disabled="!pedido.modelo"
                    :loading="loading"
                >
                    SALVAR
                </v-btn>
            </v-col>
        </v-row>
    </v-form>

    <ModalRelatorios 
        :withOutFilter="true"
        :idPedido="props.id"
        :isActiveModal="showModalReport"
        @setInactiveModal="showModalReport = $event"
    />
</template>
<script setup>
    const axios = inject("axios");
    const loading = inject("loading");
    const showToastify = inject("showToastify");
    const validForm = inject("validateForm");
    const router = useRouter();
    const formatteDateDB = inject("formatteDateDB");

    const props = defineProps([ 'id' ]);
    
    const showModalReport = ref(false);

    const form = ref(null);
    const dateSelected = ref(new Date(router.currentRoute.value.query.date))
    const pedido = ref({
        client: null,
        modelo: null,
        dataPedido: null,
        dataFinalizado: null,
        dataPagamento: null,
        relatorioCliente: null,
        totalDinheiro: null,
        totalPares: null,
        grade: [],
        obs: null,
        metragemRecebido: [],
        metragemFinalizado: [],
        rendimentoParesMetro: [],
        tipoRecebido: [],
        cor: [],
        quemAssinou: null,
        dataRetirada: null,
    });
    const clients = ref([]);
    const clientSelected = ref(null);
    const clientsNames = ref([]);
    const modelos = ref([]);
    const materiais = ref([]);
    const nomesColunas = ref([
        { title: 'Nome', align: 'center', key: 'tipo' },
        { title: 'preco', align: 'center', key: 'preco' },
        { title: 'Ação', align: 'center', key: 'ver' },
    ]);

    const getClientes = async () => {
        await axios.get("/clients/active").then(response => {
            if(response.length > 0) {
                response.forEach(client => {
                    clientsNames.value.push(`${client.nome} - ${client.telefone}`);
                });
                clients.value = response;
            }
        }).catch(err => console.error(err));
    }

    const getPedido = async () => {
        await axios.get(`/orders/${props.id}`).then(response => {
            pedido.value.client = response.client;
            clientSelected.value = `${response.client.nome} - ${response.client.telefone}`;
            modelos.value.push(response.modelo);
            pedido.value.modelo = response.modelo;
            pedido.value.dataPedido = new Date(response.dataPedido);
            if(response.dataPagamento) pedido.value.dataPagamento = new Date(response.dataPagamento);
            if(response.dataFinalizado) pedido.value.dataFinalizado = new Date(response.dataFinalizado);
            pedido.value.relatorioCliente = response.relatorioCliente;
            pedido.value.totalDinheiro = response.totalDinheiro;
            pedido.value.totalPares = response.totalPares;
            pedido.value.tipoRecebido = response.tipoRecebido.split(',').map(Number);
            pedido.value.metragemRecebido = response.metragemRecebido.split(',').map(Number);
            pedido.value.metragemFinalizado = response.metragemFinalizado ? response.metragemFinalizado.split(',').map(Number) : [];
            pedido.value.rendimentoParesMetro = response.rendimentoParesMetro ? response.rendimentoParesMetro.split(',').map(Number) : [];
            pedido.value.cor = response.cor ? response.cor.split(',') : [];
            pedido.value.obs = response.obs;
            
            const arrayGrade = response.grade.split(',');
            arrayGrade.map(item => {
                pedido.value.grade.push({ grade: item.split(":")[0] , qtd: Number(item.split(":")[1]) });
            });
            
            if(response.dataRetirada) pedido.value.dataRetirada = new Date(response.dataRetirada);
            pedido.value.quemAssinou = response.quemAssinou;
        }).catch(e => console.error(e));
    }

    const getModelos = async (idClient) => {
        await axios.get(`/models/client/${idClient}`).then(response => {
            if(response.length > 0) {
                modelos.value = response;
            };
        }).catch(err => console.error(err));
    }

    const getMateriais = async () => {
        await axios.get(`/materials/active`).then(response => {
            if(response.length > 0) {
                materiais.value = response;
            };
        }).catch(err => console.error(err));
    }

    const validateForm = async () => {
        const error = await validForm(form);

        if(error.valid) {
            const fieldsRequired = [
                { name: 'Client', value: pedido.value.client },
                { name: 'dataPedido', value: pedido.value.dataPedido },
                { name: 'gradeForm', value: pedido.value.grade },
                { name: 'tipoRecebido', value: pedido.value.tipoRecebido },
                { name: 'metragemRecebido', value: pedido.value.metragemRecebido },
                { name: 'metragemFinalizado', value: pedido.value.metragemFinalizado },
            ];
    
            const errors = fieldsRequired.filter(field => !field.value);

            if(pedido.value.tipoRecebido.length !== pedido.value.metragemRecebido.length || 
            (pedido.value.metragemFinalizado.length > 0 && pedido.value.tipoRecebido.length !== pedido.value.metragemFinalizado.length)) {
                showToastify("Quantidade divergentes de materiais e metragens!", "info");
                return false;
            }

            if(pedido.value.cor.length > 0 && pedido.value.tipoRecebido.length !== pedido.value.cor.length) {
                showToastify("Quantidade divergentes de materiais e cores!", "info");
                return false;
            }

            const totalGrade = pedido.value.grade.reduce((total, item) => total += item.qtd, 0);
            if(Number(pedido.value.totalPares) !== totalGrade) {
                showToastify("Quantidade divergentes de pares e grades!", "info");
                return false;
            }
    
            if (errors.length > 0) {
                showToastify("Campos obrigatórios sem preenchimento!", "error");
                return false;
            }
            
            submitPedido();
            return true;
        }
    };

    const formateddPrice = (key) => {
        const price = pedido.value.totalDinheiro;
        let priceText = String(price).replace(/\D/g, '');
        let result = 0;

        if (!priceText.includes('.') && priceText.length < 3) {
            priceText = "0" + priceText;
        };
        if(priceText[0] === '0' && priceText.length > 3) priceText = priceText.slice(1);
        if (priceText.length >= 2) result = priceText.slice(0, -2) + "." + priceText.slice(-2);
        else result = priceText;
        result = Number(result);
        if(key.target.value.slice(-1) === '0') result = Number(result).toFixed(3);
        
        pedido.value.totalDinheiro = result;
    }

    const calculateTotal = () => {
        const model = props.id !== '0' ? pedido.value.modelo : modelos.value.find(item => item.id === pedido.value.modelo);
        pedido.value.totalDinheiro = Number(Number(model.preco) * Number(pedido.value.totalPares)).toFixed(3);
    }

    const setNewValor = (ev) => {
        pedido.value.grade[ev.index].grade = ev.grade;
        pedido.value.grade[ev.index].qtd = ev.qtd;
    }
    const addNewItemGrade = () => {
        if(!qtdParesMenorQueGrade()) return;
        else if (pedido.value.grade.length > 0 && pedido.value.grade[pedido.value.grade.length - 1].qtd === null) {
            showToastify('Preencha a o item anterior', 'info');
            return;
        };
        pedido.value.grade.push({ grade: '', qtd: null });
    }
    const removeItemGrade = (ev) =>{
        pedido.value.grade.splice(ev.index, 1);
    }
    const qtdParesMenorQueGrade = () => {
        const total = pedido.value.grade.reduce((total, item) => total += item.qtd, 0);
        const result = total < pedido.value.totalPares;
        if(!result) showToastify("Quantidades de pares divergentes!", 'info');
        return result;
    }

    const submitPedido = async () => {
        let dados = pedido.value;

        dados.dataPedido = formatteDateDB(pedido.value.dataPedido);
        dados.dataFinalizado = pedido.value.dataFinalizado ? formatteDateDB(pedido.value.dataFinalizado) : null;
        dados.dataPagamento = pedido.value.dataPagamento ? formatteDateDB(pedido.value.dataPagamento) : null;
        dados.dataRetirada = pedido.value.dataRetirada ? formatteDateDB(pedido.value.dataRetirada) : null;
        dados.tipoRecebido = pedido.value.tipoRecebido.join(",");
        dados.metragemRecebido = pedido.value.metragemRecebido.join(",");
        dados.metragemFinalizado = pedido.value.metragemFinalizado ? pedido.value.metragemFinalizado.join(",") : null;
        dados.rendimentoParesMetro = pedido.value.rendimentoParesMetro ? pedido.value.rendimentoParesMetro.join(",") : null;
        dados.cor = pedido.value.cor ? pedido.value.cor.join(",") : null;
        dados.totalDinheiro = Number(pedido.value.totalDinheiro);
        dados.totalPares = Number(pedido.value.totalPares);
        
        let gradeString = "";
        pedido.value.grade.map((item , i) => {
            gradeString += `${item.grade}:${item.qtd}${i < pedido.value.grade.length - 1 ? "," : ""}`;
        });
        dados.grade = gradeString;
        
        if(props.id !== '0') {
            dados.id = props.id;

            await axios.put("/orders", dados).then(response => {
                setTimeout(() => {
                    voltar(); 
                }, 1000);
            }).catch(e => console.error(e));
        } else {
            const model = modelos.value.filter(item => item.id === dados.modelo);
            dados.modelo = model[0];

            await axios.post("/orders/create-order", dados).then(response => {
                setTimeout(() => {
                    voltar(); 
                }, 1000);
            }).catch(e => console.error(e));
        }
    };

    const voltar = () => {
        clientSelected.value = null;
        clientsNames.value = [];
        modelos.value = [];
        materiais.value = [];
        pedido.value = {
            client: null,
            modelo: null,
            dataPedido: null,
            dataFinalizado: null,
            dataPagamento: null,
            relatorioCliente: null,
            totalDinheiro: null,
            totalPares: null,
            grade: [],
            obs: null,
            metragemRecebido: [],
            metragemFinalizado: [],
            rendimentoParesMetro: [],
            cor: [],
            tipoRecebido: [],
            quemAssinou: null
        }
        
        router.push('/pedidos')
    };

    watch(() => clientSelected.value, (nv) => {
        if(nv) {
            if(!props.id || props.id === '0') {
                const [ nome, telefone ] = clientSelected.value.split(" - ");
                const clientArray = clients.value.filter(client => client.nome === nome && client.telefone === telefone);

                pedido.value.client =clientArray[0];

                getModelos(pedido.value.client.id);
            }
            getMateriais();

        } else {
            pedido.value.client = null;
            modelos.value = [];
        }
    });

    onMounted(() => {
        if(props.id && props.id !== '0') getPedido();
        else {
            getClientes();
            pedido.value.dataPedido = dateSelected.value;
            pedido.value.dataFinalizado = dateSelected.value;
        }
    });
</script>
<style scoped>

</style>