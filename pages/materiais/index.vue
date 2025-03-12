<template>
    <v-row class="h-100 justify-center align-center">
        <v-col cols="12" v-show="showMaterialForm && !loading">
            <FormMaterial 
                :idMaterial="idMaterial"
                @voltar="voltarListagemMateriais($event)"
            />
        </v-col>
        <v-col cols="12" v-show="!idMaterial && !showMaterialForm">
            <DataTable 
                v-show="materiais.length > 0"
                title="Listagem de materiais cadastrados"
                :items="materiais"
                :headers="nomesColunas" 
                :acaoVer="true"
                @verId="showForm($event)"
            />
        </v-col>

        <v-col cols="12" class="text-center pb-12" v-if="!showMaterialForm && !loading">
            <v-btn 
                variant="flat"
                color="success"
                rounded="xl"
                @click="showMaterialForm = true"
            >
                CADASTRAR MATERIAL
            </v-btn>
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject("axios");
    const loading = inject("loading");
    const showMaterialForm = ref(false);
    const idMaterial = ref(false);
    const nomesColunas = ref([
        { title: 'Nome', align: 'center', key: 'nome' }, 
        { title: 'Ativo', align: 'center', key: 'situacao' }, 
        { title: 'Ação', align: 'center', key: 'ver' }, 
    ]);
    const materiais = ref([]);

    const getMateriais = async () => {
        await axios.get("/materials").then(response => {
            response.forEach(material => {
                material.icons = true;
                material.situacao = material.ativo ? "mdi-thumb-up" : "mdi-thumb-down";
            });
            materiais.value = response;
        }).catch(err => console.error(err));
    }

    const showForm = (ev) => {
        idMaterial.value = ev; 
        showMaterialForm.value = true;
    };

    const voltarListagemMateriais = (ev) => {
        idMaterial.value = ev;
        showMaterialForm.value = ev;
        getMateriais();
    };

    onBeforeMount(() => {
        getMateriais();
    });
</script>