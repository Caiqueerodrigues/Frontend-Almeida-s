<template>
    <v-row class="justify-center ma-4">
        <v-col cols="12" class="text-center d-flex justify-space-between align-center mb-4">
            <h2 class="text-secondary">{{ props.title }}</h2>
            <h2 class="text-secondary">{{ props.subTitle }}</h2>
            <v-btn 
                variant="flat" 
                class="rounded-xl" 
                color="success"
                @click="randomColors"
            >
                TROCAR CORES
            </v-btn>
        </v-col>
        <v-col cols="12" md="12" class="chart-container">
            <component
                :is="chartComponent"
                :chartData="dataChart"
                :options="mergedOptions"
                v-if="isClient && chartComponent"
                style="width:100%;height:100%;"
            />
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
    labels: Array,
    data: Array,
    type: { type: String, default: 'doughnut' },
    title: String,
    subTitle: String,
    options: Object
});

const chartComponent = ref(null);
const isClient = ref(false);

const defaultOptions = {
    plugins: {
        legend: {
            labels: {
                font: {
                    weight: "bolder",
                    size: 14
                }
            }
        },
        tooltip: {
            titleColor: '#Fff',
            bodyColor: '#FFF',
            callbacks: {
                label: function (context) {
                    return context.label + ': ' + context.raw;
                }
            }
        }
    },
    responsive: true
};

const mergedOptions = computed(() => {
    return { ...defaultOptions, ...(props.options || {}) };
});

const optionsHex = [1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];
const backgroundColor = ref([]);

const randomColors = () => {
    backgroundColor.value = [];
    for (let i = 0; i < props.labels.length; i++) {
        let color = "#";
        do {
            for (let j = 0; j < 6; j++) {
                color += optionsHex[Math.floor(Math.random() * optionsHex.length)];
            }
        } while (backgroundColor.value.includes(color));
        backgroundColor.value.push(color);
    }
};

const dataChart = computed(() => {
    // Se props.data for array de arrays/objetos, monta datasets múltiplos
    if (Array.isArray(props.data) && props.data.length && typeof props.data[0] === 'object' && props.data[0].data) {
        return {
            labels: props.labels,
            datasets: props.data.map((ds, idx) => ({
                label: ds.label || `Linha ${idx + 1}`,
                data: ds.data,
                borderColor: ds.borderColor || backgroundColor.value[idx] || '#1976D2',
                backgroundColor: ds.backgroundColor || backgroundColor.value[idx] || '#1976D2',
                fill: false
            }))
        };
    }
    // Caso padrão (um dataset)
    return {
        labels: props.labels,
        datasets: [
            {
                label: props.title || 'Dados',
                data: props.data,
                backgroundColor: backgroundColor.value
            }
        ]
    };
});

const mountGraph = async () => {
    let chartName = '';
    switch (props.type.toLowerCase()) {
        case 'bar':
            chartName = 'BarChart';
            break;
        case 'line':
            chartName = 'LineChart';
            break;
        case 'pie':
            chartName = 'PieChart';
            break;
        case 'doughnut':
            chartName = 'DoughnutChart';
            break;
        case 'bubble':
            chartName = 'BubbleChart';
            break;
        case 'polararea':
            chartName = 'PolarAreaChart';
            break;
        case 'scatter':
            chartName = 'ScatterChart';
            break;
        default:
            chartName = 'radar';
    }
    const { [chartName]: LoadedChart } = await import('vue-chart-3');
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    chartComponent.value = LoadedChart;
};

watch(() => props.labels, () => {
    randomColors();
    mountGraph();
});
watch(() => props.type, () => {
    mountGraph();
});

onMounted(() => {
    if (typeof window !== 'undefined') {
        isClient.value = true;
        randomColors();
        mountGraph();
    }
});
</script>
<style scoped>
    .chart-container {
        width: 100%;
        max-width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .chart-container canvas {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
    }
</style>