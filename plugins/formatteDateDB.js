import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(() => {
        const formatteDateDB = (date) => {
            const offset = - 3 * 60;
            const formattedDate = new Date(date.getTime() + (offset * 60 * 1000)).toISOString().split('.')[0];
            return formattedDate;
        }

        nuxtApp.vueApp.provide('formatteDateDB', formatteDateDB);
    });
});
