import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const showToastfy = inject("showToastify");

    nuxtApp.vueApp.use(() => {
        const validateForm = async (formName) => {
            const errors = await formName.value.validate();
            if(!errors.valid) showToastfy("Campos obrigatórios sem preenchimento!", 'error');
            return errors;
        };

        nuxtApp.vueApp.provide('validateForm', validateForm);
    });
});
