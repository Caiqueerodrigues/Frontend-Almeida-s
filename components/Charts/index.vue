<template>
    <v-row class="justify-center mt-4">
        <v-col cols="12" md="7" class="text-center">
            <v-btn 
                variant="flat" 
                class="rounded-xl" 
                color="success"
                @click="randomColors()"
            >
                TROCAR CORES
            </v-btn>
        </v-col>
    </v-row>
    <DoughnutChart :chartData="dataChart" />
</template>

<script setup>
    const DoughnutChart = ref(null);
    const props = defineProps(['labels', 'data', 'headers', 'acaoVer']);

    const dataChart = computed(() => {
        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
        const backgroundColor = [];

        for (let i = 0; i < props.labels.length; i++) {
            let color = "#";
            do {
                for (let j = 0; j < 6; j++) {
                    color += options[Math.floor(Math.random() * options.length)];
                }
            } while (backgroundColor.includes(color));

            backgroundColor.push(color);
        }

        return {
            labels: props.labels,
            datasets: [
                {
                    data: props.data,
                    backgroundColor: backgroundColor
                }
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                weight: "bolder",
                                size: 126
                            }
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleColor: '#000',
                        bodyColor: '#000',
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.raw;
                            }
                        }
                    }
                }
            }
        };
    });

    const isClient = ref(false);

    const randomColors = () => {
        const options = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", 'E', "F"];
        const length = dataChart.value.labels.length;
        dataChart.value.datasets[0].backgroundColor = [];

        for(let i = 0; i < length; i++) {
            let color = "#";
            do {
                for (let j = 0; j < 6; j++) {
                    color += options[Math.floor(Math.random() * (options.length - 1))];
                }
            } while (dataChart.value.datasets[0].backgroundColor.includes(color));

            dataChart.value.datasets[0].backgroundColor.push(color);
        }
    }

    watch(() => props.labels, (nv) => {
        mountGraph();
    })

    const mountGraph = async () => {
        const { DoughnutChart: LoadedDoughnutChart } = await import('vue-chart-3');
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);

        DoughnutChart.value = LoadedDoughnutChart;
    }

    onMounted(async () => {
        if (typeof window !== 'undefined') {
            isClient.value = true;

            mountGraph();
        }
        randomColors();
    });
</script>
