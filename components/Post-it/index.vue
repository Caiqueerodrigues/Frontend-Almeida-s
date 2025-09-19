<template>
    <div
        class="postit"
        :style="[
            { left: saida.x + 'px', top: saida.y + 'px', backgroundColor: backgroundColors[saida?.tipoServico] },
        ]"
        draggable="true"
        @dragstart="onDragStart"
        @click="emitEvent(saida.id)"
    >
        <p class="text-center">
            SEGUIMENTO: <strong>{{ saida.tipoServico }}</strong><br>
        </p>
        <p class="text-center">
            Valor: R$ {{ formattePrice(saida?.valorCompra) }}
        </p>
        <p class="text-center">
            ANOTAÇÕES: {{ saida.anotacoes }}
        </p>
    </div>
</template>
<script setup>
    const props = defineProps({
        saida: Object,
        formattePrice: Function,
        onDragStart: Function,
        backgroundColors: Object,
    });
    const emit = defineEmits([ 'navigate' ]);

    const emitEvent = (id) => {
        emit('navigate', id)
    }
</script>
<style scoped>
    .postit {
        position: absolute;
        user-select: none;
        cursor: grab;
        padding: 20px;
        width: 200px;
        min-height: 100px;
        color: #A60014;
        border-radius: 10px;
        font-weight: bold;
        font-weight: bold;
        text-align: center;
        box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
        transition: transform 0.2s;
    }

    .postit:active {
        box-shadow: 4px 8px 24px #0003;
    }

    .postit:hover {
        transform: rotate(-2deg) scale(1.05);
    }
</style>