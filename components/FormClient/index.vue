<template>
    <v-form ref="formClient">
        <v-row class="h-100 w-100 justify-center align-center">
            <v-col cols="12" class="text-center">
                <span class="text-h4 text-secondary font-weight-bold">
                    {{ props.id ? 'Editar o' : 'Cadastrar um novo' }} cliente
                </span>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Nome do cliente"
                    v-model="cliente.nome"
                    variant="outlined"
                    :rules="[(value) => !!value || 'O nome é obrigatório!']"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Razão social"
                    v-model="cliente.razaoSocial"
                    variant="outlined"
                    :rules="[(value) => !!value || 'A razão social é obrigatório!']"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Telefone"
                    v-model="cliente.telefone"
                    variant="outlined"
                    v-mask="'(##) #####-####'"
                    :rules="[(value) => !!value || 'O telefone é obrigatório!']"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-textarea
                    v-model="cliente.obs"
                    rounded="xl"
                    rows="4"
                    variant="outlined"
                    auto-grow
                    label="Observevação"
                    counter
                    cleareble
                    maxlength="255"
                ></v-textarea>
            </v-col>
            <v-col cols="12" md="7" class="pl-7 text-center">
                <FormAtivo 
                    :valueInicial="cliente.ativo"
                    @setValue="cliente.ativo = $event"
                />
            </v-col>
            <v-col cols="12" class="text-center pb-12">
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
                >
                    SALVAR
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
<script setup>
    const axios = inject("axios");
    const formClient = ref(null);
    const props = defineProps([ 'id' ]);
    const emit = defineEmits([ 'voltar' ]);
    const cliente = ref({
        nome: '',
        razaoSocial: '',
        telefone: '',
        ativo: true,
        obs: ''
    });

    const getCliente = async () => {
        axios.get(`/clients/${props.id}`).then(response => {
            cliente.value = response;
        }).catch(err => console.error(err));
    };

    const voltar = (value) => {
        formClient.value.reset();
        cliente.value = {
            nome: '',
            razaoSocial: '',
            telefone: '',
            ativo: true,
            obs: ''
        };
        emit('voltar', value);
    }

    const validateForm = async () => {
        const errors = await formClient.value.validate();
        if(errors.valid) {
            if(cliente.value.id) sendPutMaterial();
            else sendPostMaterial();
        }
    };

    const sendPostMaterial = async () => {
        delete cliente.value.id;

        axios.post(`/clients`, cliente.value).then(response => {
            voltar();
        }).catch(err => console.error(err));
    };

    const sendPutMaterial = async () => {
        axios.put(`/clients`, cliente.value).then(response => {
            voltar();
        }).catch(err => console.error(err));
    };


    watch(() => props.id, (nv, od) => {
        if(props.id) getCliente();
    });
</script>