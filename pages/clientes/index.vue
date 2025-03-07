<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" v-show="showForm">
            <FormClient 
                :id="id"
                @voltar="voltarListagemMateriais($event)"
            />
        </v-col>
        <v-col cols="12" v-show="!id && !showForm">
            <DataTable 
                title="Listagem de clientes cadastrados"
                :items="clients"
                :headers="nomesColunas" 
                :acaoVer="true"
                @verId="showFormFunc($event)"
            />
        </v-col>

        <v-col cols="12" class="text-center pb-12" v-if="!showForm">
            <v-btn 
                variant="flat"
                color="success"
                rounded="xl"
                @click="showForm = true"
            >
                CADASTRAR CLIENTE
            </v-btn>
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject("axios");
    const showForm = ref(false);
    const id = ref(false);
    const nomesColunas = ref([
        { title: 'Nome', align: 'center', key: 'nome' },  
        { title: 'Telefone', align: 'center', key: 'telefone' }, 
        { title: 'Ação', align: 'center', key: 'ver' }, 
    ]);
    const clients = ref([]);

    const getClients = async () => {
        axios.get('/clients').then(response => {
            response.forEach(client => {
                client.icons = true;
                client.ver = 'mdi-pencil'
            });
            clients.value = response;
        }).catch(err => console.error(err));
    };

    const showFormFunc = (ev) => {
        id.value = ev; 
        show.value = true;
    };

    const voltarListagemMateriais = (ev) => {
        id.value = ev;
        show.value = ev;
    };

    onBeforeMount(() => getClients());
</script>