import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(() => {
        const formattePrice = (price) => {
            return Number(price).toFixed(3);
        };

        nuxtApp.vueApp.provide('formattePrice', formattePrice);
    });
});
