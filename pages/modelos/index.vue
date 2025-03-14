<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" md="7" class="pt-12">
            <h2 class="text-secondary font-weight-bold text-center pb-4">Listagem de modelos</h2>
            <h3 class="text-secondary font-weight-bold text-center pb-4">Selecione o cliente</h3>
            <v-autocomplete
                v-model="clientSelected"
                clearable
                label="Digite ou selecione o cliente"
                :items="clientsNames"
                variant="outlined"
                rounded="xl"
                :disabled="clientComplete && modelos.length > 0"
                prepend-inner-icon="mdi-account-tie"
            ></v-autocomplete>
        </v-col>
        <v-col cols="12" v-show="(idModelo || showForm) && !loading">
            <FormModels 
                v-show="showForm"
                :client="clientComplete"
                :idModelo="idModelo"
                @voltar="voltarListagem($event)"
            />
        </v-col>
        <v-col cols="12" md="7" v-show="!showForm">
            <h2 class="text-center text-secondary" v-if="clientComplete && modelos.length === 0">
                Não existem modelos cadastrados para este cliente
            </h2>
            <DataTable 
                v-if="clientComplete && modelos.length > 0"
                title="Listagem de modelos"
                :items="modelos"
                :headers="nomesColunas" 
                :acaoVer="true"
                @verId="showFormFunc($event)"
            />
        </v-col>
        <v-col cols="12" class="text-center pb-12" v-if="!showForm && clientComplete">
            <v-btn 
                variant="outlined"
                rounded="xl"
                class="mr-4 mb-4"
                @click="voltarListagem(false)"
            >
                CANCELAR
            </v-btn>
            <v-btn 
                class="mb-4"
                variant="flat"
                color="success"
                rounded="xl"
                @click="showForm = true"
            >
                CADASTRAR MODELO
            </v-btn>
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject("axios");
    const loading = inject("loading");
    const showForm = ref(false);
    const nomesColunas = ref([
        { title: 'Tipo', align: 'center', key: 'tipo' },
        { title: 'Preço', align: 'center', key: 'preco' },
        { title: 'Ação', align: 'center', key: 'ver' },
    ]);

    const clients = ref([]);
    const clientComplete = ref(null);
    const clientsNames = ref([]);
    const clientSelected = ref(null);
    const modelos = ref([]);
    const idModelo = ref(null);

    const getClients = async () => {
        await axios.get('/clients').then(response => {
            if(response.length > 0) {
                response.forEach(client => {
                    clientsNames.value.push(`${client.nome} - ${client.telefone}`);
                });
            }
            clients.value = response;
        }).catch(err => console.error(err));
    };

    const getModelsClient = async (idClient) => {
        await axios.get(`/models/client/${idClient}`).then(response => {
            if(response.length > 0) {
                response.forEach(model => {
                    model.icons = true;
                });
            }
            modelos.value = response;
        }).catch(err => console.error(err));
    }

    const showFormFunc = (ev) => {
        idModelo.value = ev;
        showForm.value = true;
    };

    const voltarListagem = (ev) => {
        clientSelected.value = null;
        idModelo.value = null;
        showForm.value = ev;
    };

    watch(() => clientSelected.value, (nv) => {
        if(nv) {
            const [ nome, telefone ] = clientSelected.value.split(" - ");
            clientComplete.value = clients.value.filter( client => client.nome === nome && client.telefone === telefone);
            getModelsClient(clientComplete.value[0].id);
        } else {
            clientComplete.value = null;
            modelos.value = [];
        }
    });

    onBeforeMount(() => getClients());
</script>