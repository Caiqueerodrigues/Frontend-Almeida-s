<template>
    <v-row class="justify-center ma-4">
        <v-col cols="12" class="text-center d-flex justify-space-between align-center mb-4">
            <h2 class="text-secondary">{{ props.title }}</h2>
            <v-btn 
                variant="flat" 
                class="rounded-xl" 
                color="success"
                @click="randomColors"
            >
                TROCAR CORES
            </v-btn>
        </v-col>
        <v-col cols="12" md="12">
            <component
                :is="chartComponent"
                :chartData="dataChart"
                :options="mergedOptions"
                v-if="isClient && chartComponent"
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
            titleColor: '#000',
            bodyColor: '#000',
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

const dataChart = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            data: props.data,
            backgroundColor: backgroundColor.value
        }
    ]
}));

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
