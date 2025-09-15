<template>
    <v-row class="pt-4 justify-center align-center">
        <v-col cols="10" class="text-center pt-4">
            <h2 class="text-center text-secondary">
                LISTAGEM DE SAÍDAS
            </h2>
        </v-col>
        <v-col cols="5">
            <DatePicker 
                name="dataListagemSaidas"
                :date="selectedDate"
                :onlyDate="true"
                @dateEmit="setDate($event)"
            />
        </v-col>
        <v-col cols="5">
            <v-select
                chips
                class="w-75 mx-auto pt-6"
                label="Tipo de Serviço"
                v-model="filterService"
                :items="[ 'Todos', 'Corte', 'Debruagem', 'Dublagem' ]"
                variant="outlined"
                rounded="xl"
            ></v-select>
        </v-col>
        <v-col cols="10" class="text-center pt-4">
            <h2 v-if="saidas.length > 0" class="text-center text-secondary">
                TOTAL DE SAÍDAS R$ {{ formattePrice(totalSaidas) }}
            </h2>
        </v-col>
        <v-col cols="10" class="text-center pb-12" v-if="saidasFiltrados.length > 0">
            <DataTable 
                :title="'Listagem de Saídas ' + saidasFiltrados.length"
                :items="saidasFiltrados"
                :headers="nomesColunas" 
                :acaoVer="true"
                :redirect="true"
                @verId="showFormFunc($event)"
            />
        </v-col>
    </v-row>
</template>
<script setup>
    const axios = inject('axios');
    const formattePrice = inject("formattePrice");
    
    const router = useRouter();

    const saidas = ref([]);
    const selectedDate = ref(new Date());
    const filterService = ref('Todos');
    const nomesColunas = ref([
        { title: 'ID Saída', align: 'center', key: 'id', maxWidth: '100px' },
        { title: 'Tipo Serviço', align: 'center', key: 'tipoServico' },
        { title: 'Valor', align: 'center', key: 'valorCompra' },
        { title: 'Anotações', align: 'center', key: 'anotacoes' },
        { title: 'Usuário', align: 'center', key: 'user' },
    ]);

    const getSaidas = async () => {
        filterService.value = 'Todos';
        await axios.post('/exit', { date: '2025-09-12' }).then(response => {
            saidas.value = response
        })
    }

    const totalSaidas = computed(() => {
        return saidasFiltrados.value.reduce((acc , item) => acc + item.valorCompra, 0);
    });

    const setDate = (ev) => {
        const date = new Date(ev);
        selectedDate.value = date;
    }

    const saidasFiltrados = computed(() => {
        if (filterService.value === 'Todos') return saidas.value;

        let saidasSelecionadas = [];

        if (filterService.value !== 'Todos') {
            if(filterService.value !== 'Corte') {
                saidasSelecionadas = saidas.value.filter(saida =>
                    saida.modelo?.tipo.toLowerCase().includes(filterService.value.toLowerCase())
                );
            } else {
                saidasSelecionadas = saidas.value.filter(saida =>
                    !saida.modelo?.tipo.toLowerCase().includes('dublagem') && !saida.modelo?.tipo.toLowerCase().includes('debruagem')
                );
            }
        }
        return saidasSelecionadas;
    });

    const showFormFunc = (ev = 0) => {
        router.push(`/saida/${ev}`);
    };

    getSaidas();
</script>
<style scooped>
</style>