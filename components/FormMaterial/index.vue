<template>
    <v-form ref="form" class="h-100">
        <v-row class="align-center justify-center h-100 w-100 font-weight-bold">
            <v-col cols="12" class="text-center">
                <span class="text-h4 text-secondary font-weight-bold">
                    {{ material.id ? 'Editar o' : 'Cadastrar um novo' }} material
                </span>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Nome do material"
                    v-model="material.nome"
                    variant="outlined"
                    :rules="[(value) => !!value || 'O nome é obrigatório!']"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="text-center">
                <FormAtivo 
                    :valueInicial="material.ativo"
                    @setValue="material.ativo = $event"
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
    const form = ref(null);    
    const axios = inject("axios");
    const loading = inject('loading');
    const props = defineProps([ 'idMaterial' ]);
    const emit = defineEmits([ 'voltar' ]);

    const material = ref({
        nome: "",
        ativo: true,
        id: null,
    });

    const handleEnterKey = (ev) => {
        ev.preventDefault();
    };


    const validateForm = async () => {
        const errors = await form.value.validate();
        if(errors.valid) {
            if(material.value.id) sendPutMaterial();
            else sendPostMaterial();
        }
    };

    const getMaterial = async () => {
        axios.get(`/materials/${props.idMaterial}`).then(response => {
            material.value = response;
        }).catch(err => console.error(err));
    };

    const sendPutMaterial = async () => {
        axios.put(`/materials`, material.value).then(response => {
            voltar();
        }).catch(err => console.error(err));
    };

    const sendPostMaterial = async () => {
        delete material.value.id;

        axios.post(`/materials`, material.value).then(response => {
            voltar();
        }).catch(err => console.error(err));
    };

    const voltar = () => {
        form.value.reset();
        material.value = {
            nome: "",
            ativo: true,
            id: null
        };
        emit('voltar', false);
    };

    watch(() => props.idMaterial, (nv, od) => {
        if(nv) getMaterial();
    });
</script>