import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(() => {
        const formattePrice = (price) => {
            const fixed3 = Number(price).toFixed(3);;

            if(fixed3[fixed3.length - 1] === '0') return Number(price).toFixed(2)
            return Number(price).toFixed(3);
        };

        nuxtApp.vueApp.provide('formattePrice', formattePrice);
    });
});
