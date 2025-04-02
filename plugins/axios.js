import { defineNuxtPlugin } from '#app';
import { decodeJwt } from 'jose';
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const baseURL = useRuntimeConfig().public.API_BACKEND;
    const showToastfy = inject("showToastify");
    const router = useRouter();
    const loading = useState('loading', () => false);
    const nomeUser = useState('nomeUser', () => "");

    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 5000, 
    });

    axiosInstance.interceptors.request.use(config => {
        loading.value = true; 
        
        const token = sessionStorage.getItem('user');
        
        if (!token && !config.url.includes('/users')) {
            showToastfy("Por favor, efetue o login!", "error");
            router.push('/login')
            loading.value = false;
            return Promise.reject('Token não encontrado, redirecionando para o login');
        }

        if (token) {
            const token = sessionStorage.getItem('user');

            try {
                const decoded = decodeJwt(token);;

                nomeUser.value = decoded.name;
                
                // Verifique a expiração do token
                if (decoded.exp && decoded.exp < Date.now() / 1000 && decoded.refresh_token < Date.now() / 1000) {
                    sessionStorage.removeItem('user');
                    showToastfy("Por favor, efetue novamente o login!", "error");
                    return router.push('/login');
                }
            } catch (err) {
                showToastfy("Por favor, efetue novamente o login!", "error");
                sessionStorage.removeItem('user');
                return router.push('/login');
            }

            config.headers['Authorization'] = `Bearer ${token}`;
        } 

        return config;
    }, error => {
        loading.value = false;
        showToastfy(error.response.data.msgErro, "error");
        return Promise.reject(error);
    });

    axiosInstance.interceptors.response.use(response => {
        loading.value = false;
        // if(!response.config.url.includes('/users'))  {
        //     sessionStorage.setItem('token', response?.headers?.get('Authorization').split(" ")[1]);
        // }
        if (response.config.url.includes('/report/generate')) {
            if(response.data.MsgAlerta !== "" && response.data.response === "" ) return showToastfy(response.data.msgAlerta, "warning");
            return response.data
        };
        if(response.data.msgSucesso !== "") showToastfy(response.data.msgSucesso, "success");
        else if(response.data.msgAlerta !== "") showToastfy(response.data.msgAlerta, "warning");
        return response.data.response;
    }, error => {
        loading.value = false;
        if(error?.response?.data?.msgErro) showToastfy(error?.response?.data?.msgErro, "error");
        
        if(error?.response?.status === 403) {
            showToastfy("Por favor, efetue novamente o login!", "error");
            sessionStorage.removeItem('user');
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        }
        
        return Promise.reject(error);
    });

    nuxtApp.vueApp.provide('axios', axiosInstance);
    nuxtApp.provide('axios', axiosInstance);
    nuxtApp.vueApp.provide('loading', loading);
    nuxtApp.vueApp.provide('nomeUser', nomeUser);
});
