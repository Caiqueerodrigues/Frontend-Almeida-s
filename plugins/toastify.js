import { defineNuxtPlugin } from '#app';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(() => {
        const showToastify = (message, type) => {
            toast(message, {
                theme: 'colored',
                type: type,
                autoClose: 2000,
                dangerouslyHTMLString: true
            });
        };

        nuxtApp.vueApp.provide('showToastify', showToastify);
  });
});
