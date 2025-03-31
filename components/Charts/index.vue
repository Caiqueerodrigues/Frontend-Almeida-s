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
    import ChartJS from 'chart.js';
    const { Chart, registerables } = ChartJS;

    Chart.register(...registerables);

    const props = defineProps(['labels', 'data', 'headers', 'acaoVer']);

    const dataChart = ref({
        labels: props.labels,
        datasets: [
            {
                data: props.data,
                backgroundColor: []
            }
        ],
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            wight: "bolder",
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
                        label: function(context) {
                            return context.label + ': ' + context.raw;
                        }
                    }
                }
            }
        }
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

    onMounted(() => {
        isClient.value = true;
        randomColors()
    });
</script>
