<template>
    <v-form ref="formClient">
        <v-row class="h-100 w-100 justify-center align-center">
            <v-col cols="12" class="text-center mt-4">
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
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7 pb-0">
                <v-text-field
                    rounded="xl"
                    label="Telefone"
                    type="tel"
                    v-model="cliente.telefone"
                    variant="outlined"
                    v-mask="[ cliente.telefone.length < 16 ? '(##) #####-####' : '## (##) #####-####' ]"
                    :rules="[
                        (value) => !!value || 'O telefone é obrigatório!'
                    ]"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7 pt-0 text-center">
                <v-btn
                    variant="flat"
                    rounded="xl"
                    color="success"
                    class="ml-4 mt-2"
                    :disabled="cliente.telefone.length < 15"
                    @click="toGoWhatsapp(cliente.telefone)"
                >
                    <v-icon>
                        mdi-whatsapp
                    </v-icon>
                    &nbsp; IR PARA WHATSAPP
                </v-btn>
                <v-btn
                    variant="flat"
                    rounded="xl"
                    color="success"
                    class="ml-4 mt-2"
                    :disabled="cliente.telefone.length < 15"
                    @click="callClient()"
                >
                    <v-icon>
                        mdi-phone
                    </v-icon>
                    &nbsp;LIGAR
                </v-btn>
                <v-btn
                    variant="flat"
                    rounded="xl"
                    color="success"
                    class="ml-4 mt-2"
                    @click="copyToClipboard()"
                    :disabled="cliente.telefone.length < 15 || textBtn === 'COPIADO!'"
                >
                    <v-icon>
                        mdi-content-copy
                    </v-icon>
                    &nbsp;{{ textBtn }}
                </v-btn>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-textarea
                    v-model="cliente.obs"
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
                    :loading="loading"
                >
                    SALVAR
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
<script setup>
    const axios = inject("axios");
    const loading = inject('loading');
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
    const textBtn = ref("COPIAR");

    const getCliente = async () => {
        axios.get(`/clients/${props.id}`).then(response => {
            cliente.value = response;
        }).catch(err => console.error(err));
    };

    const voltar = (value) => {
        textBtn.value = "COPIAR TELEFONE";
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

    const copyToClipboard = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(numero).then(() => {
                textBtn.value = "COPIADO!"

                setTimeout(() => {
                    textBtn.value = "COPIAR TELEFONE";
                }, 1000 * 2);
            }).catch(err => {
                console.error('Falha ao copiar o texto: ', err);
            });
        } else {
            console.warn('O navegador não suporta a API Clipboard');
        }
    }

    const toGoWhatsapp = (fone) => {
        let telefone = fone.replace(/[^0-9]/g, '');
        telefone = `55${telefone}`;
        const link = `https://api.whatsapp.com/send?phone=${telefone}`;

        window.open(link)
    }

    const callClient = () => {
        const numero = cliente.value.telefone.replace(/[^0-9]/g, '');
        window.location.href = `tel:${numero}`;
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