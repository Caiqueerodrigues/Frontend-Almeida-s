<template>
    <v-row class="pt-4 justify-center align-center">
        <v-col cols="10">
            <h2 class="text-center text-secondary">
                LISTAGEM DE LANÇAMENTOS
            </h2>
            <div class="d-flex">
                <DatePicker 
                    name="dataListagemSaidas"
                    class="w-25"
                    :date="selectedDate"
                    :onlyDate="true"
                    @dateEmit="setDate($event)"
                />
                <v-select
                    chips
                    class="w-25 mx-4"
                    label="Tipo de Serviço"
                    v-model="filterService"
                    :items="seguimentos"
                    variant="outlined"
                    rounded="xl"
                ></v-select>
                <v-btn 
                    variant="flat" 
                    class="rounded-xl btn-cadastrar" 
                    color="success"
                    @click="showFormFunc()"
                >
                    CADASTRAR LANÇAMENTO
                </v-btn>
            </div>
            <h2 v-if="saidas.length > 0" class="text-center text-secondary">
                TOTAL DE SAÍDAS R$ {{ formattePrice(totalSaidas) }} - {{ saidasFiltrados.length }} Lançamentos
            </h2>
        </v-col>
        <v-col 
            v-if="saidasFiltrados.length > 0"
            cols="12" 
            class="drag"
            ref="dragContainer"
            @dragover.prevent
            @drop="onDrop"
        >
            <PostIt
                v-for="(saida, idx) in saidasFiltrados"
                :key="saida.id"
                :saida="saida"
                :backgroundColors="colors"
                :formattePrice="formattePrice"
                :onDragStart="() => onDragStart(idx)"
                @navigate="navigateSaida($event)"
            />
        </v-col>
    </v-row>
</template>
<script setup>
import { SEGUIMENTOS } from '~/constantes/seguimentos';

    const axios = inject('axios');
    const formattePrice = inject("formattePrice");
    
    const router = useRouter();

    const seguimentos = [ 'Todos', ...SEGUIMENTOS ]
    const dragContainer = ref(null);
    const saidas = ref([]);
    const selectedDate = ref(new Date());
    const filterService = ref('Todos');
    const draggingIdx = ref(null);

    const colors = ref({
        "Corte": "#FFEB8D",
        "Dublagem": "#A5D6A7",
        "Debruagem": "#F8B4D9",
    })
    const typesLayout = ref({
        "Corte": { x: 5, y: 5, offsetY: 120 },
        "Dublagem": { x: 305, y: 5, offsetY: 120 },
        "Debruagem": { x: 605, y: 5, offsetY: 120 },
    });

    const onDragStart = (idx) => {
        draggingIdx.value = idx;
    };

    const onDrop = (event) => {
        if (draggingIdx.value !== null && dragContainer.value) {
            const rect = dragContainer.value.$el
                ? dragContainer.value.$el.getBoundingClientRect()
                : dragContainer.value.getBoundingClientRect();
            
            const containerHeight = rect.height;
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            const saida = saidasFiltrados.value[draggingIdx.value];
            
            if (y > containerHeight) {
                if (saida.tipoServico === 'Corte') {
                    x = 305;
                    y = 5;
                } else if (saida.tipoServico === 'Dublagem') {
                    x = 605;
                    y = 5;
                } else if (saida.tipoServico === 'Debruagem') {
                    x = 5;
                    y = 5;
                }
            }

            saidasFiltrados.value[draggingIdx.value].x = x;
            saidasFiltrados.value[draggingIdx.value].y = y;

            draggingIdx.value = null;
        }
    };


    const getSaidas = async () => {
        filterService.value = 'Todos';
        saidas.value = [];
        typesLayout.value = { "Corte": { x: 5, y: 5, offsetY: 120 }, "Dublagem": { x: 305, y: 5, offsetY: 120 }, "Debruagem": { x: 605, y: 5, offsetY: 120 }}

        let date = selectedDate.value;
            date.setHours(date.getHours() - 3);
            date = date.toISOString().split("T")[0];

        await axios.post('/exit', { date: date }).then(response => {
            if(response.length > 0) {
                saidas.value = response.map(saida => {
                    const layout = typesLayout.value[saida.tipoServico];
                    
                    const updatedSaida = {
                        ...saida,
                        x: layout.x,
                        y: layout.y,
                    };

                    typesLayout.value[saida.tipoServico].y += (layout.offsetY + 20);

                    return updatedSaida;
                });
            }
        })
    }

    const totalSaidas = computed(() => {
        return saidasFiltrados.value.reduce((acc , item) => acc + item.valorCompra, 0);
    });

    const setDate = (ev) => {
        const date = new Date(ev);
        selectedDate.value = date;
        getSaidas();
    }

    const saidasFiltrados = computed(() => {
        if (filterService.value === 'Todos') return saidas.value;

        let saidasSelecionadas = [];

        if (filterService.value !== 'Todos') {
            if(filterService.value !== 'Corte') {
                saidasSelecionadas = saidas.value.filter(saida =>
                    saida?.tipoServico.toLowerCase().includes(filterService.value.toLowerCase())
                );
            } else {
                saidasSelecionadas = saidas.value.filter(saida =>
                    !saida?.tipoServico.toLowerCase().includes('dublagem') && !saida?.tipoServico.toLowerCase().includes('debruagem')
                );
            }
        }
        return saidasSelecionadas;
    });

    const showFormFunc = (ev = 0) => {
        router.push(`/saida/${ev}`);
    };

    const navigateSaida = (id) => {
        router.push(`saida/${id}`);
    }

    watch(saidasFiltrados, (novasSaidas) => {
        novasSaidas.forEach(saida => {
            if (saida.x === undefined) saida.x = 0;
            if (saida.y === undefined) saida.y = 0;
        });
    });

    getSaidas();
</script>
<style scooped>
    .btn-cadastrar {
        height: 55px !important;
        padding-inline: 40px !important;
    }

    .btn-cadastrar {
        height: 55px !important;
        padding-inline: 40px !important;
    }
    .drag {
        position: relative;
        min-height: 70dvh;
        overflow-y: auto;
    }
</style>