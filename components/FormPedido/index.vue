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
                    :disabled="pedido.client !== null"
                    prepend-inner-icon="mdi-account-tie"
                ></v-autocomplete>
            </v-col>
            <v-col cols="12" class="text-secondary" v-show="!loading && pedido.client">
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
                <v-row class="justify-center">
                    <v-col col="12" md="6">
                        <DatePicker 
                            :range="false"
                            title="DATA DE INÍCIO"
                            :date="pedido.dataInicio"
                            name="dataInicio"
                            @dateEmit="pedido.dataInicio = $event"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DatePicker 
                            :range="false"
                            title="DATA DE CONCLUSÃO"
                            name="dataConclusao"
                            :date="pedido.dataFinalizado"
                            format="dd-MM-yyyy HH:mm:ss"
                            @dateEmit="pedido.dataFinalizado = $event"
                        />
                    </v-col>
                    <v-col cols="12">
                        <DatePicker 
                            :range="false"
                            title="DATA DO PAGAMENTO"
                            :date="pedido.dataPagamento"
                            name="dataPagamento"
                            format="dd-MM-yyyy HH:mm:ss"
                            @dateEmit="pedido.dataPagamento = $event"
                        />
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" md="7" v-show="pedido.modelo">
                <v-text-field
                    rounded="xl"
                    label="Referência do calçado"
                    type="tel"
                    v-model="pedido.relatorioCliente"
                    variant="outlined"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
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
                    variant="flat"
                    color="success"
                    rounded="xl"
                    @click="validateForm()"
                    :loading="loading"
                >
                    SALVAR
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

    const axios = inject("axios");
    const loading = inject("loading");
    const showToastify = inject("showToastify");
    const validForm = inject("validateForm");

    const props = defineProps([ 'id', 'date' ]);
    const emit = defineEmits([ 'voltar' ]);

    const form = ref(null);
    const pedido = ref({
        client: null,
        modelo: null,
        dataInicio: props.date,
        dataFinalizado: null,
        dataPagamento: null,
        relatorioCliente: null,

        obs: null,
    });
    const clients = ref([]);
    const clientSelected = ref(null);
    const clientsNames = ref([]);
    const modelos = ref([]);
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

    const getModelos = async (idClient) => {
        await axios.get(`/models/client/${idClient}`).then(response => {
            if(response.length > 0) {
                modelos.value = response;
            }
        }).catch(err => console.error(err));
    }

    const validateForm = async () => {
        const error = await validForm(form);

        if(error.valid) {
            const fieldsRequired = [
                { name: 'Client', value: pedido.value.client },
                { name: 'DataInicio', value: pedido.value.dataInicio },
            ];
    
            const errors = fieldsRequired.filter(field => !field.value);
    
            if (errors.length > 0) {
                showToastify("Campos obrigatórios sem preenchimento!", "error");
                return false;
            }
            showToastify("Sucesso", 'success');
            return true;
        }
    };

    const format = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date
            .toISOString()
            .split("T")[1]
            .split('.')[0];

        return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year} ${hour}`;
    }
    
    const voltar = () => {
        clientSelected.value = null;
        pedido.value.client = null;
        pedido.value.modelo = null;
        clientsNames.value = [];
        modelos.value = [];
        emit('voltar', false);
    };

    watch(() => props.id, (nv, od) => {
        if(nv || nv === 0) {
            getClientes();
        }
    });

    watch(() => clientSelected.value, (nv) => {
        if(nv) {
            const [ nome, telefone ] = clientSelected.value.split(" - ");
            pedido.value.client = clients.value.filter(client => client.nome === nome && client.telefone === telefone);
            getModelos(pedido.value.client[0].id);
        } else {
            pedido.value.client = null;
            modelos.value = [];
        }
    });
</script>
<style scoped>

</style>