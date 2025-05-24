import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('capitalize-first', {
        mounted(el) {
            const inputEl = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
                ? el
                : el.querySelector('input, textarea');

            if (!inputEl) return;
            
            el.addEventListener('input', (event) => {
                const input = event.target;
                if (!input || typeof input.value !== 'string') return;

                //capitalizar somente a primeira letra
                let capitalized = input.value;
                input.value = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);

                //capitalizar o restante das palavras com length > 3
                capitalized = input.value
                    .split(' ')
                    .map(word => {
                        if (word.length > 2) {
                            return word.charAt(0).toUpperCase() + word.slice(1);
                        }
                        return word;
                    })
                    .join(' ');

                input.value = capitalized;

                input.dispatchEvent(new Event('input'));
            });
        }
    });
});