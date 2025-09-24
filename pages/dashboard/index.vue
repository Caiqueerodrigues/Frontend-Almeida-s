<template>
    <v-row class="justify-center ga-4 pt-8">
        <v-col cols="10" class="bg-graph rounded-xl h-25">
            <Charts
                :labels="['A', 'B', 'C']"
                :data="[5, 15, 25]"
                type="bar"
                title="Meu Gráfico de Barras"
            />
        </v-col>
        <v-col cols="5" class="bg-graph rounded-xl h-25">
            <Charts
                :labels="['Janeiro', 'Fevereiro', 'Março']"
                :data="[10, 20, 30]"
                type="line"
                title="Meu Gráfico de Linhas"
            />
        </v-col>
        <v-col cols="5" class="bg-graph rounded-xl h-25">
            <Charts
                :labels="['A', 'B', 'C']"
                :data="[5, 15, 25]"
                type="pie"
                title="Meu Gráfico de Pizza"
            />
        </v-col>
        <v-col cols="5" class="bg-graph rounded-xl h-25">
            <Charts
                :labels="['A', 'B', 'C']"
                :data="[{ x: 1, y: 5 }, { x: 2, y: 15 }, { x: 3, y: 25 }]"
                type="scatter"
                title="Meu Gráfico de Dispersão"
            />
        </v-col>
    </v-row>
</template>
<style scooped>
    .bg-graph {
        background-color: #f5f5f5ab;
    }
</style>