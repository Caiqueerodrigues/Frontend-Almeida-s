<template>
    <v-row class="h-100 justify-center pb-12">
        <v-col cols="12" class="text-center">
            <h2 class="text-center text-secondary mt-4">
                LISTAGEM DE REGISTRO DE FUNCIONÁRIOS
            </h2>
            <div class="container-anotacoes d-flex">
                <p 
                    v-for="item in mensagens" 
                    :key="item.id"

                >
                    {{ item.texto }}
                </p>
            </div>
        </v-col>

        <v-col cols="4">
            <VueDatePicker 
                v-model="date" 
                range 
                autoApply
                locale="pt-BR"
                dark
                format="dd/MM/yyyy"
                :clearable="false"
                :min-date="new Date('2000-01-01')"
                :max-date="adjustedDate(new Date())"
                @update:modelValue="getDados()"
            />
        </v-col>
        <v-col cols="4">
            <v-select
                chips
                class="w-75 mx-auto"
                label="Funcionário"
                v-model="filter"
                :items="nomes"
                variant="outlined"
                rounded="xl"
            ></v-select>
        </v-col>

        <v-col cols="8" v-if="selecteds.length > 0">
            <h2 class="text-center text-secondary mt-4" v-html="calculateTotalHours(selecteds)"></h2>
            <v-text-field
                rounded="xl"
                type="number"
                label="Valor pago por hora"
                v-model="valorHora"
                variant="outlined" 
                class="mt-6 w-25 mx-auto"
            ></v-text-field>
            <h2 class="text-center text-secondary mt-4" v-html="calculateTotalHours(selecteds, true)"></h2>
            <div class="container-anotacoes d-flex">
                <p v-html="calculateTotalHours(selecteds, false, true, 44)"></p>
                <p v-html="calculateTotalHours(selecteds, false, true, 88)"></p>
            </div>
        </v-col>

        <v-col cols="12" class="text-center mt-4">
            <v-btn
                class="bg-success text-primary font-weight-bold rounded-xl"
                size="large"
                variant="outlined"
                @click="getDados()"
            >
                BUSCAR
            </v-btn>
            <v-btn
                class="bg-warning text-primary font-weight-bold rounded-xl ml-4"
                size="large"
                variant="outlined"
                v-if="selecteds.length > 0"
                @click="pagosEmLote()"
            >
                MARCAR COMO PAGOS ({{ selecteds.length }})
            </v-btn>
            <v-btn
                class="bg-success text-primary font-weight-bold rounded-xl ml-4"
                size="large"
                variant="outlined"
                v-if="formatDate(date[0]) === formatDate(date[1])"
                @click="addRegistro()"
            >
                ADICIONAR REGISTRO
            </v-btn>
        </v-col>

        <v-col cols="12" v-for="(item, index) in filtrados" :key="index" class="py-0">
            <v-row class="ma-0 pa-0 align-center">
                <v-col cols="2" class="py-0 d-flex">
                    <v-checkbox
                        v-if="formatDate(date[0]) !== formatDate(date[1]) && !item.status"
                        v-model="checked[index]"
                        :value="item.id"
                        color="success"
                        @change="checkboxSelected(item, index)"
                        hide-details
                    ></v-checkbox>
                    <v-text-field
                        v-capitalize-first
                        rounded="xl"
                        label="Nome do funcionário"
                        v-model="item.nomeFuncionario"
                        variant="outlined" 
                        class="mt-6"
                        :rules="[(value) => !!value || 'O nome é obrigatório!']"
                    ></v-text-field>
                </v-col>
                <v-col cols="2" class="py-0">
                    <VueDatePicker 
                        v-model="item.date" 
                        autoApply
                        locale="pt-BR"
                        dark
                        format="dd/MM/yyyy"
                        :clearable="false"
                        :min-date="new Date('2000-01-01')"
                        :max-date="new Date()"
                    />
                </v-col>
                <v-col cols="5" class="d-flex ga-2 py-0">
                    <v-text-field
                        v-for="(hr, i) in item.horarios" 
                        v-model="item.horarios[i]"
                        :key="i"
                        class="mt-6"
                        rounded="xl"
                        :label="i % 2 === 0 ? 'E' : 'S'"
                        @blur="i === item.horarios.length - 1 ? addHorario(item.horarios) : null"
                        style="max-width: 80px;"
                        @input="formatTime($event, i, item)"
                        variant="outlined"
                    ></v-text-field>

                    <p class="text-secondary font-weight-bold mt-6" v-html="calculateHours(item.horarios)"></p>
                </v-col>
                <v-col cols="2" class="px-0 text-end">
                    <v-btn-toggle color="success" v-model="item.status" bg class="rounded-xl" divided>
                        <v-btn 
                            :value="true" 
                            :disabled="item.status" 
                            class="font-weight-bold"
                            @click="checkboxSelected(item, index)"
                        >
                            PAGO
                        </v-btn>
                        <v-btn 
                            :value="false" 
                            :disabled="!item.status"
                            class="font-weight-bold"
                        >
                            DEVIDO
                        </v-btn>
                    </v-btn-toggle>
                </v-col>
                <v-col cols="1" class="py-0">
                    <v-btn
                        class="bg-success text-primary font-weight-bold rounded-xl"
                        size="large"
                        variant="outlined"
                        @click="saveRegister(item)"
                    >
                        SALVAR
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';

    const axios = inject("axios");
    const showToastify = inject("showToastify");
    const formatteDateDB = inject("formatteDateDB");

    const date = ref([new Date(), new Date()]);
    const mensagens = ref([
        { id: 1, texto: '44 horas semanais (5 dias trabalhados)' },
        { id: 2, texto: '88 horas quinzenais (10 dias trabalhos, duas semanas)' },
        { id: 2, texto: 'Pagamentos quinzenais, dia 20 até dia 4, recebe dia 05' },
        { id: 3, texto: 'Pagamentos quinzenais, dia 5 até dia 19, recebe dia 20' },
    ]);
    const dados = ref([]);
    const selecteds = ref([]);
    const checked = ref([]);
    const valorHora = ref(16.48);
    const filter= ref('Todos');

    const adjustedDate = (date) => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + 3);
        return newDate;
    };

    const getDados = async () => {
        const dateInitial = formatteDateDB(date.value[0]).split("T")[0];
        const dateFinal = formatteDateDB(date.value[1]).split("T")[0];
        dados.value = [];
        checked.value = [];
        selecteds.value = [];
        valorHora.value = 16.48;
        filter.value = 'Todos';

        axios.get(`/employee/${dateInitial}/${dateFinal}`)
            .then(response => {
                response.forEach(item => {
                    item.date = item.date + 'T00:00:00';
                })
                dados.value = response;
            }).catch(error => console.error("Erro ao buscar dados:", error));
    }

    const addHorario = (horarios) => {
        if(horarios.length < 6) horarios.push('00:00', '00:00');
    };

    const formatTime = (event, index, item) => {
        let value = event.target.value.replace(/\D/g, "").replace(/^0+/, "");
        
        value = value.slice(0, 4).padStart(4, "0");

        let hours = value.slice(0, 2);
        let minutes = value.slice(2, 4);

        
        let formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        
        item.horarios[index] = formatted;
        event.target.value = formatted;
    };

    const parseTimeToMinutes = (time) => {
        if (!time || !time.includes(':')) return 0;
        const [h, m] = time.split(':').map(Number);
        return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    };

    const calculateHours = (horarios) => {
        let totalMinutes = 0;

        for (let i = 1; i < horarios.length; i += 2) {
            const entrada = parseTimeToMinutes(horarios[i - 1]);
            const saida = parseTimeToMinutes(horarios[i]);
            if (saida > entrada) {
                totalMinutes += saida - entrada;
            }
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours} horas e <br> ${minutes} minutos`;
    };

    const calculateTotalHours = (selecionado, total, diferenca, totalHoras) => {
        const horariosPorFuncionario = dados.value.filter(dado => selecionado.includes(dado.id)).map(dado => dado.horarios);
        let totalMinutes = 0;

        horariosPorFuncionario.forEach(horarios => {
            for (let i = 1; i < horarios.length; i += 2) {
                const entrada = parseTimeToMinutes(horarios[i - 1]);
                const saida = parseTimeToMinutes(horarios[i]);
                if (saida > entrada) {
                    totalMinutes += saida - entrada;
                }
            }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (diferenca) {
            const totalHorasEmMinutos = totalHoras * 60;
            const diferencaBruta = totalMinutes - totalHorasEmMinutos;
            const diferencaMinutes = Math.abs(diferencaBruta);

            const diferencaHours = Math.floor(diferencaMinutes / 60);
            const diferencaRemainingMinutes = diferencaMinutes % 60;

            const sinal = diferencaBruta >= 0 ? '+' : '-';

            return `HORAS ${totalHoras === 44 ? 'SEMANAIS' : 'QUINZENAIS'} ${totalHoras + ' horas'} <br> ${sinal} ${diferencaHours} horas e ${diferencaRemainingMinutes} minutos`;
        }

        return  !total ? `TOTAL DE ${hours} horas e <br> ${minutes} minutos` : `TOTAL DE R$ ${((hours) * valorHora.value).toFixed(2)}`;
    }

    const formatDate = (d) => {
        return d?.toISOString().split('T')[0];
    };

    const checkboxSelected = (item, index) => {
        if(!selecteds.value.includes(item.id)) {
            selecteds.value.push(item.id);
        } else {
            checked.value[index] = false;
            selecteds.value = selecteds.value.filter(selected => selected !== item.id);
        }
    }

    const saveRegister = async (item) => {
        if(!item.nomeFuncionario || !item.date || item.horarios.every(hr => hr === "00:00")) {
            showToastify("Informe dados válidos para o registro!", 'info');
            return;
        }

        let adjustedDate = new Date(item.date);
            adjustedDate.setHours(adjustedDate.getHours() - 3);

        let dadosEnviar = { ...item, date: adjustedDate };
        dadosEnviar.horarios = item.horarios.filter(item => item !== "00:00").join(", ");

        if(item.id) {
            axios.put('/employee', dadosEnviar).then(response => {
                getDados();
            }).catch(err => console.error(err));
        } else {
            axios.post('/employee', dadosEnviar).then(response => {
                getDados();
            }).catch(err => console.error(err));
        }
    };

    const addRegistro = () => {
        let novoRegistro = {
            nomeFuncionario: '',
            date: null,
            horarios: ['00:00', '00:00'],
            status: false
        };
        dados.value.unshift(novoRegistro);
    };

    const pagosEmLote = async () => {
        axios.put('/employee/update-status-payment', selecteds.value).then(response => {
            getDados();
            selecteds.value = [];
            checked.value = [];
            valorHora.value = 16.48;
        }).catch(err => console.error(err));
    }

    const filtrados = computed(() => {
        if (!filter.value || filter.value === "Todos") return dados.value;

        return dados.value.filter(dado => dado.nomeFuncionario === filter.value);
    });

    const nomes = computed(() => {
        const nomes = ['Todos'];
        dados.value.map(item => {
            if(!nomes.includes(item.nomeFuncionario)) nomes.push(item.nomeFuncionario);
        })
        return nomes;
    });

    onMounted(() => {
        getDados();
    })
</script>
<style scoped>
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
        padding-bottom: 20px;
    }

    :deep(.v-btn--variant-elevated, .v-btn--variant-flat) {
        background-color: #139026;
        padding-inline: 4px;
    }

    .container-anotacoes {
    width: 100%;
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.container-anotacoes p {
    padding: 20px;
    width: 200px;
    background: #fdfd96;
    border-radius: 10px;
    color: #A60014;
    font-weight: bold;
    font-weight: bold;
    font-family: 'Comic Sans MS', cursive, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
    transition: transform 0.2s;
}

    .container-anotacoes p:hover {
        transform: rotate(-2deg) scale(1.05);
    }

</style>
