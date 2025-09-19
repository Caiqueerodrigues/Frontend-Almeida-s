<template>
    <v-row class="justify-center align-center" v-if="showForm">
        <v-col cols="12" class="pt-8">
            <h2 class="text-center text-secondary">{{ id ? 'Editar ' : 'Cadastrar' }} Lançamento</h2>
        </v-col>
        <v-col cols="5" v-if="id">
            <DatePicker 
                :range="false"
                title="DATA DO LANÇAMENTO"
                :date="lancamento.dataRegistro"
                name="dataRegistro"
                :disabled="true"
            />
        </v-col>
        <v-col :cols=" id ? '5' : '10'">
            <DatePicker 
                :range="false"
                title="DATA DA COMPRA"
                :date="lancamento.dataCompra"
                :onlyDate="true"
                name="dataCompra"
                @dateEmit="lancamento.dataCompra = $event"
            />
        </v-col>
        <v-col cols="5" class="d-flex">
            <v-text-field
                rounded="xl"
                label="Total do lançamento"
                v-model="lancamento.valorCompra"
                type="number"
                variant="outlined"
                class="w-25"
                :rules="[(value) => !!value || 'O total é obrigatório!']"
                @input="formateddPrice($event)"
            ></v-text-field>

        </v-col>
        <v-col cols="5">
            <AutoCompleteMultiple 
                v-capitalize-first
                :label="'Seguimento'"
                :items="SEGUIMENTOS"
                :selecteds="lancamento.tipoServico"
                :outsideList="false"
                :type="'text'"
                :maxLength="1"
                @salvar="lancamento.tipoServico = $event[0]"
            />
        </v-col>
        <v-col cols="10">
            <v-textarea
                v-capitalize-first
                v-model="lancamento.anotacoes"
                rounded="xl"
                rows="4"
                variant="outlined"
                auto-grow
                label="Anotações"
                counter
                cleareble
                maxlength="255"
            ></v-textarea>
        </v-col>
        <v-col cols="10" class="text-center">
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
                class="mr-2"
                rounded="xl"
                :loading="loading"
                @click="validateData()"
            >
                SALVAR
            </v-btn>
        </v-col>
    </v-row>
</template>
<script setup>
    import { SEGUIMENTOS } from '~/constantes/seguimentos';

    const showToastify = inject("showToastify")
    const formatteDateDB = inject("formatteDateDB")
    const axios = inject("axios")
    const router = useRouter();
    const route = useRoute();

    const id = ref(null);
    const loading = ref(false);
    const showForm = ref(true);

    const lancamento = ref({
        id: null,
        dataRegistro: null,
        dataCompra: new Date(),
        valorCompra: 0,
        tipoServico: null,
        anotacoes: ''
    });

    const formateddPrice = (key) => {
        const price = lancamento.value.valorCompra;
        let priceText = String(price).replace(/\D/g, '');
        let result = 0;

        if (!priceText.includes('.') && priceText.length < 2) {
            priceText = "0" + priceText;
        };
        if(priceText[0] === '0' && priceText.length > 2) priceText = priceText.slice(1);
        if (priceText.length >= 2) result = priceText.slice(0, -2) + "." + priceText.slice(-2);
        else result = priceText;
        result = Number(result);
        if(key.target.value.slice(-1) === '0') result = Number(result).toFixed(2);
        
        lancamento.value.valorCompra = result;
    }

    const getLancamento = async () => {
        loading.value = true;
        showForm.value = false;

        axios.get(`exit/${id.value}`).then(response => {
            loading.value = false;
            showForm.value = true;

            response.dataCompra = new Date(response.dataCompra + "T04:00:00.000")
            response.dataRegistro = new Date(response.dataRegistro)
            lancamento.value = response;
        }).catch(err => {
            showForm.value = true;
            loading.value = false;
            console.error(err)
        })
    }

    const validateData = () => {
        if(!lancamento.value.dataCompra) {
            showToastify('Data da compra inválida.', 'error');
            return;
        } else if(!lancamento.value.valorCompra) {
            showToastify('Valor da compra inválido.', 'error');
            return;
        } else if(!lancamento.value.tipoServico) {
            showToastify('Seguimento da compra inválido.', 'error');
            return;
        } else if(!lancamento.value.anotacoes) {
            showToastify('Anotações da compra inválido.', 'error');
            return;
        }
        submit();
    }

    const submit = () => {
        const dataCompra = lancamento.value.dataCompra; 
        if (dataCompra.getHours() !== 1 && dataCompra.getMinutes() !== 0 && dataCompra.getSeconds() !== 0) {
            lancamento.value.dataCompra = formatteDateDB(lancamento.value.dataCompra);
        }

        if(id.value) {
            axios.put('exit', lancamento.value).then(response => {
                setTimeout(() => {
                    router.push('/financeiro')
                }, 1000);
            }).catch(err => console.error(err));
        }else {
            axios.post('exit/create', lancamento.value).then(response => {
                setTimeout(() => {
                    router.push('/financeiro')
                }, 1000);
            }).catch(err => console.error(err));
        }
    }

    const voltar = () => {
        router.push('/financeiro');
    }

    onBeforeMount(() => {
        id.value = route.params.id !== '0' ? route.params.id : null;
        if(id.value) getLancamento();
    });
</script>