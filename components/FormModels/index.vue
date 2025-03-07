<template>
    <v-form ref="form" class="h-100">
        <v-row class="align-center justify-center h-100 w-100 font-weight-bold">
            <v-col cols="12" class="text-center">
                <span class="text-h4 text-secondary font-weight-bold">
                    {{ modelo.id ? 'Editar o' : 'Cadastrar um novo' }} modelo
                </span>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Tipo do calçado"
                    v-model="modelo.tipo"
                    variant="outlined"
                    :rules="[(value) => !!value || 'O tipo é obrigatório!']"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Preço do calçado"
                    v-model="modelo.preco"
                    variant="outlined"
                    :rules="[(value) => !!value || 'O preço é obrigatório!']"
                    @input="formateddPrice"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Ordem do calçado"
                    v-model="modelo.refOrdem"
                    variant="outlined"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Qtd de facas"
                    v-model="modelo.qtdFaca"
                    variant="outlined"
                    type="number"
                    :rules="[ (value) => !!value || 'A quantidade de facas é obrigatório!' ]"
                    @keydown.enter="handleEnterKey($event)"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Rendimento por M²"
                    v-model="modelo.rendimento"
                    disabled
                    type="number"
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-text-field
                    rounded="xl"
                    label="Cronometragem por Hr"
                    v-model="modelo.cronometragem"
                    type="number"
                    disabled
                    variant="outlined"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="7" class="pl-7">
                <v-textarea
                    v-model="modelo.obs"
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
            <v-col 
                cols="12" 
                md="7" 
                v-for="(foto, index) in modelo.fotos"
                :key="index"
            >
                <v-img
                    width="100%"
                    height="200px"
                    cover
                    :src="foto.routeFile"
                    class="ma-3 rounded-xl d-flex justify-space-between"
                >
                    <v-icon
                        @click="triggerPhotoInput(index)"
                        class="text-primary pa-8"
                        size="30"
                    >
                        mdi-pencil
                    </v-icon>
                </v-img>
                <v-text-field
                    rounded="xl"
                    label="Nome da peça"
                    v-model="foto.nomeFile"
                    class="mx-2"
                    :rules="[(value) => !!value || 'O nome da peça é obrigatório!']"
                    variant="outlined"
                ></v-text-field>
                <v-file-input 
                    ref="photoInput"
                    :key="index"
                    style="display: none;"
                    accept=".png, .jpg, .jpeg, .svg"
                    @change="handleFileChange(index, $event)"
                ></v-file-input>
            </v-col>
            <v-col cols="12" class="text-center">
                <v-btn
                    variant="flat"
                    color="warning"
                    rounded="xl"
                    @click="adcFoto()"
                >
                    ADICIONAR FOTOS
                </v-btn>
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
    const form = ref(null);
    const axios = inject("axios");
    const props = defineProps([ 'client', 'idModelo' ]);
    const emit = defineEmits([ 'voltar' ]);

    const modelo = ref({
        tipo: "",
        preco: 0,
        qtdPecasPar: 2,
        refOrdem: "",
        fotos: '',
        qtdFaca: 0,
        rendimento: 0,
        cronometragem: 0,
        obs: "",
        fotos: []
    });
    const photoInput = ref(null);

    const handleEnterKey = (ev) => {
        ev.preventDefault();
    };

    const validateForm = async () => {
        const errors = await form.value.validate();
        if(errors.valid) {
            if(modelo.value.id) sendPutModelo();
            else sendPostModelo();
        }
    };

    const getModelo = async () => {
        axios.get(`/models/${props.idModelo}`).then(response => {
            if(response.fotos.length > 0) response.fotos.map(foto => foto.nomeFile = foto.nomeFile.split("_")[0]);
            modelo.value = response;
            modelo.value.client = props.client[0];
        }).catch(err => console.error(err));
    };

    const sendPutModelo = async () => {
        if(modelo.value.fotos) formatteFotosSubmit();
        axios.put(`/models`, modelo.value).then(response => {
            voltar();
        }).catch(err => console.error(err));
    };

    const formatteFotosSubmit = () => {
        let fotos = "";
        modelo.value.fotos.map((item, index) => {
            fotos += `${item.id}${index < modelo.value.fotos.length ? ',' : ''}`;
        });
        delete modelo.value.fotos;
        modelo.value.fotos = fotos;
    }

    const sendPostModelo = async () => {
        delete modelo.value.id;
        modelo.value.client = props.client[0];

        axios.post(`/models`, modelo.value).then(response => {
            voltar();
        }).catch(err => console.error(err));
    };

    const adcFoto = () => {
        modelo.value.fotos.push({ nomeFile: "", routeFile: "" });
        setTimeout(() => {
            triggerPhotoInput(modelo.value.fotos.length - 1);
        }, 500);
    };

    const triggerPhotoInput = (i) => {
        photoInput.value[i].click();
    }

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                modelo.value.fotos[index].routeFile = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    const formateddPrice = (key) => {
        let priceText = String(modelo.value.preco).replace(/\D/g, '');

        if (!priceText.includes('.') && priceText.length < 3) {
            priceText = "0" + priceText;
        };
        if(priceText[0] === '0' && priceText.length > 3) priceText = priceText.slice(1);
        if (priceText.length >= 2) modelo.value.preco = priceText.slice(0, -2) + "." + priceText.slice(-2);
        else modelo.value.preco = priceText;
        modelo.value.preco = Number(modelo.value.preco);
        if(key.target.value.slice(-1) === '0') modelo.value.preco = Number(modelo.value.preco).toFixed(2);
    }

    watch(() => props.idModelo, (nv, od) => {
        if(nv) getModelo();
    });

    const voltar = () => {
        form.value.reset();
        modelo.value = {
            tipo: "",
            preco: 0,
            qtdPecasPar: 2,
            refOrdem: "",
            fotos: '',
            qtdFaca: 0,
            rendimento: 0,
            cronometragem: 0,
            obs: "",
            fotos: []
        };
        emit('voltar', false);
    };
</script>