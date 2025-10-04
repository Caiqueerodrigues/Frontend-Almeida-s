<template>
    <v-row>
        <v-col>
            <v-dialog 
                max-width="100%" 
                min-height="95%" 
                v-model="props.isActiveModal"
                persistent
            >
                <template v-slot:default="{ isActive }">
                    <v-card
                        class="text-surface bg-primary text-center "
                        prepend-icon="mdi-finance"
                        :title="`${props.title ?? 'Relatórios'}`"
                    >
                        <template #append>
                            <v-icon
                                @click="setInactiveModal()"
                                size="30"
                            >
                                mdi-close
                            </v-icon>
                        </template>
                        <v-card-text class="px-0 pb-0">
                            <v-row class="justify-space-evenly">
                                <v-col cols="12" class="px-0 mb-1">
                                    <v-divider :thickness="4" color="white" />
                                </v-col>
                                <v-col cols="10" md="5" class="pa-0 text-center" v-if="!props.withOutFilter">
                                    <v-select
                                        chips
                                        label="Tipo de filtro"
                                        v-model="filters.firstFilter"
                                        :items="[ 'CATEGORIA SERVIÇO', 'CLIENTE', 'PERÍODO', 'CLIENTE E PERÍODO', 'SITUAÇÃO', 'MENSAL' ]"
                                        variant="outlined"
                                        rounded="xl"
                                        :disabled="pdf"
                                    ></v-select>
                                </v-col>
                                <v-col 
                                    cols="10" 
                                    md="5" 
                                    class="pa-0 text-center" 
                                    v-if="filters.firstFilter === 'CLIENTE' || filters.firstFilter === 'CLIENTE E PERÍODO'"
                                >
                                    <v-select
                                        chips
                                        label="Cliente"
                                        v-model="filters.client"
                                        :items="clientes"
                                        item-title="nome"
                                        item-value="id"
                                        variant="outlined"
                                        rounded="xl"
                                        :disabled="pdf"
                                    ></v-select>
                                </v-col>
                                <v-col 
                                    cols="10" 
                                    md="5" 
                                    class="pa-0 text-center" 
                                    v-if="filters.firstFilter"
                                >
                                    <v-select
                                        chips
                                        label="Tipo de situação"
                                        v-model="filters.situation"
                                        :items="[ 'TODOS', 'PAGOS', 'DEVIDOS' ]"
                                        variant="outlined"
                                        rounded="xl"
                                        :disabled="pdf"
                                    ></v-select>
                                </v-col>
                                <v-col 
                                    cols="10" 
                                    md="5" 
                                    class="pa-0 text-center" 
                                    v-if="(filters.firstFilter && (filters.period || filters.client)  && filters.firstFilter !== 'CATEGORIA SERVIÇO') || props.withOutFilter"
                                >
                                    <v-select
                                        chips
                                        label="Tipo de relatório"
                                        v-model="filters.report"
                                        :items="!props.withOutFilter ? 
                                            [ 'COMPLETO', 'FECHAMENTO CLIENTE' ] :
                                            [ 'FICHAS GERAIS', 'CLIENTE', 'FICHA DE CORTE' ]"
                                        variant="outlined"
                                        rounded="xl"
                                        :disabled="pdf || filters.firstFilter === 'PERÍODO'"
                                    ></v-select>
                                </v-col>
                                <v-col 
                                    cols="10" 
                                    class="pa-0 text-center mb-6" 
                                    v-if="filters.firstFilter === 'CLIENTE E PERÍODO' || filters.firstFilter === 'PERÍODO' || filters.firstFilter === 'MENSAL' || filters.firstFilter === 'CATEGORIA SERVIÇO'"
                                >
                                    <VueDatePicker 
                                        v-model="filters.period" 
                                        range 
                                        autoApply
                                        locale="pt-BR"
                                        dark
                                        format="dd/MM/yyyy"
                                        :clearable="false"
                                        :min-date="new Date('2000-01-01')"
                                        :max-date="new Date()"
                                        :disabled="pdf"
                                    />
                                </v-col>
                            </v-row>
                            <v-row 
                                v-if="(filters.firstFilter && !props.withOutFilter && filters.firstFilter !== 'CATEGORIA SERVIÇO') || (props.withOutFilter && filters.report !== 'FICHAS GERAIS')" 
                                class="justify-center"
                            >
                                <v-col 
                                    cols="10"
                                    md="6"
                                    class="pa-0 text-center" 
                                >
                                    <v-text-field
                                        v-model="filters.quantidadeVias"
                                        type="number"
                                        rounded="xl"
                                        variant="outlined"
                                        label="Quantidade de vias"
                                        :disabled="pdf"
                                        :rules="[(value) => !!value || 'A quantidade é obrigatório!']"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" v-if="pdf">
                                    <v-btn @click="shareFile" color="success" rounded="xl" class="mx-2" variant="flat">
                                        Compartilhar
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row v-if="filters.firstFilter === 'CATEGORIA SERVIÇO'" class="justify-center">
                                <v-col cols="5" class="mx-auto">
                                    <v-select
                                        chips
                                        label="Categoria de serviço"
                                        v-model="filters.category"
                                        :items="SEGUIMENTOS"
                                        variant="outlined"
                                        rounded="xl"
                                        :disabled="pdf"
                                    ></v-select>
                                </v-col>
                                <v-col cols="5" class="mx-auto">
                                    <v-select
                                        chips
                                        label="Categoria de serviço"
                                        v-model="filters.tipo"
                                        :items="[ 'Somente Serviços', 'Serviços e Saídas', 'Saídas' ]"
                                        variant="outlined"
                                        rounded="xl"
                                        :disabled="pdf"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row v-if="pdf">
                                <v-col>
                                    <embed v-if="!mobile" :src="pdf" type="application/pdf" width="90%" height="900px" />
                                    <ViewerPDF 
                                        v-if="mobile"
                                        :pdf="pdf"
                                        :nomeFile="filters.report" 
                                    />
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <template v-slot:actions>
                            <v-col cols="12">
                                <v-btn
                                    class="text-white font-weight-bold rounded-xl mr-3 mb-2"
                                    size="large"
                                    variant="outlined"
                                    @click="setInactiveModal()"
                                >
                                    Fechar
                                </v-btn>
                                <v-btn
                                    class="text-white bg-blue font-weight-bold rounded-xl mr-3 mb-2"
                                    size="large"
                                    variant="flat"
                                    @click="clearFilters()"
                                    v-if="!props.withOutFilter"
                                >
                                    Limpar
                                </v-btn>
                                <v-btn
                                    class="bg-success text-primary font-weight-bold rounded-xl mb-2"
                                    size="large"
                                    variant="outlined"
                                    :loading="loading"
                                    @click="validateFilters()"
                                >
                                    Buscar
                                </v-btn>
                            </v-col>
                        </template>
                    </v-card>
                </template>
            </v-dialog>
        </v-col>
    </v-row>
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import { SEGUIMENTOS } from '~/constantes/seguimentos';

    const axios = inject('axios');
    const showToastify = inject('showToastify');
    const loading = ref(false);

    const emit = defineEmits(['setInactiveModal'])
    const props = defineProps([ 'isActiveModal', 'date', 'withOutFilter', 'idPedido', 'title' ]);

    const mobile = ref(false);
    const filters = ref(
        {
            firstFilter: null,
            client: null,
            period: props.date,
            report: null,
            category: null,
            tipo: null,
            situation: null,
            idPedidos: [],
            quantidadeVias: 2
        }
    );

    const clientes = ref([]);
    const pdf = ref(false);

    const getClientes= async () => {
        await axios.get('clients/active').then(response => {
            response.map(item => {
                clientes.value.push({ id: item.id, nome: item.nome });
            });
        }).catch(e => console.error(e));
    }

    const validateFilters = () => {
        let showMessage = false;
        if(!props.withOutFilter) {
            if((!filters.value.report || !filters.value.situation || (filters.value.firstFilter === "CLIENTE" && !filters.value.client)) && filters.value.firstFilter !== "CATEGORIA SERVIÇO") {
                showMessage = true;
            }
            if((filters.value.firstFilter === "PERÍODO" || filters.value.firstFilter === "CLIENTE E PERÍODO" || filters.value.firstFilter === "MENSAL") && filters.value.period.length !== 2) showMessage = true;

            if(filters.value.firstFilter === 'CATEGORIA SERVIÇO' && (!filters.value.category || !filters.value.tipo || !filters.value.period)) showMessage = true;
        } else {
            if(!filters.value.report) showMessage = true;
        }

        if(showMessage) showToastify("Campo(s) Obrigatório(s) sem preenchimento!", "info");
        else getReport();
    }

    const checkMobile = () => {
        mobile.value = window.innerWidth <= 768;
    };

    const getReport = async () => {
        let data = { ...filters.value };
            if(!props.withOutFilter) {
                data.firstFilter = data.firstFilter.replaceAll(" ", "_");
            } else {
                data.client = 0;
                data.firstFilter = "CLIENTE";
                data.idPedidos = [props.idPedido];
                data.situation = 'TODOS';
                data.idPedido = props.idPedido;
                data.period = [];
            }
            data.report = data.report;
            
        
        loading.value = true;
        await axios.post("/report/generate", data).then(response => {
            if(response) pdf.value = `data:application/pdf;base64,${response}`;
            else pdf.value = null;
            loading.value = false;
        }).catch(e => {
            loading.value = false;
            console.error(e) 
        });
    } 

    const shareFile = async () => {
        try {
            // 1. Baixar o arquivo PDF
            const response = await fetch(pdf.value);
            const pdfBlob = await response.blob();
            
            const cliente = clientes.value.length > 0 ? clientes.value.find(cliente => cliente.id === filters.value.client) : [];
            const nomeFile = cliente.nome ? `${cliente.nome} - ${filters.value.report}.pdf` : 'Pedido.pdf';

            // 2. Criar um arquivo para compartilhamento
            const file = new File([pdfBlob], nomeFile, { 
                type: 'application/pdf' 
            });
            
            // 3. Verificar se a API de compartilhamento suporta arquivos
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `Compartilhar ${nomeFile}`,
                    text: 'Aqui está o arquivo PDF que você pediu!'
                });
            } else {
                // Fallback para dispositivos que não suportam compartilhamento de arquivos
                if (navigator.share) {
                    // Compartilhar apenas texto/URL
                    await navigator.share({
                        title: `Compartilhar ${nomeFile}`,
                        text: 'Veja este arquivo PDF',
                        url: pdfSrc.value
                    });
                } else {
                    showToastify('Compartilhamento não suportado neste navegador. Use o botão de download.', 'info');
                }
            }
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            if (error.name !== 'AbortError') {
                showToastify('Não foi possível compartilhar o arquivo. Use o botão de download.', 'warning');
            }
        }
    };

    const clearFilters= () => {
        pdf.value = false;
        loading.value = false;
        filters.value = {
            firstFilter: "CLIENTE",
            client: null,
            period: [],
            report: null,
            situation: null,
            idPedidos: [],
            tipo: null,
            category: null,
            quantidadeVias: 2,
        };
    }

    const setInactiveModal = () => {
        if(!props.withOutFilter) clearFilters();
        emit('setInactiveModal', false);
    }

    watch(() => filters.value.firstFilter, (nv, ov) => {
        if(ov !== 'CATEGORIA SERVIÇO' &&  ov !== 'CLIENTE' && ov !== 'CLIENTE E PERÍODO' && (nv === 'CLIENTE' || nv === 'CLIENTE E PERÍODO') && clientes.value.length === 0) {
            getClientes();
        }

        if(nv === "PERÍODO") filters.value.report = 'COMPLETO';
        filters.value.client = null;
        if(nv === "MENSAL") filters.value.period = [];
        
        if(nv === "CATEGORIA SERVIÇO") filters.value.report = 'CATEGORIA';
    });

    watch(() => filters.value.report, (nv) => {
        if(nv === 'FECHAMENTO CLIENTE' || nv === 'FICHAS GERAIS') filters.value.quantidadeVias = 1;
        else filters.value.quantidadeVias = 2;
    })

    onMounted(() => {
        if(!props.withOutFilter) {
            checkMobile();
        } else {
            pdf.value = props.pdf;
            filters.value.report = "FICHAS GERAIS";
        }
        window.addEventListener('resize', checkMobile);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', checkMobile);
    });
</script>
<style scoped>
    :deep(.v-overlay__scrim) {
        background: #000000;
        opacity: .8;
    }

    :deep(.dp__input) {
        background-color: #A60014;
        border-radius: 20px;
        border-color: #eeff00;
        color: #eeff00;
        font-weight: bold;
        padding-block: 15px;
    }

    :deep(.dp__menu) {
        border-radius: 20px;
        border-color: #eeff00;
        font-weight: bold;
    }
</style>
