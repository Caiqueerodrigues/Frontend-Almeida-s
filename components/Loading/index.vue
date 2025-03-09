<template>
    <v-row class="container ma-0 pa-0 justify-center align-center">
        <v-col cols="1" class="ma-0 pa-0">
            <span class="loader"></span>
        </v-col>
    </v-row>
</template>
<script setup>
</script>
<style scoped>
.container {
    width: 100% !important;
    min-height: 100% !important;
    position: absolute;
    z-index: 1000;
    background-color: #000;
    overflow: hidden !important;
}

.loader {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border-top: 4px solid #E90049;
    border-right: 4px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

.loader::after {
    content: '';  
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border-left: 4px solid #C0812D;
    border-bottom: 4px solid transparent;
    animation: rotation 0.5s linear infinite reverse;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
} 
</style>