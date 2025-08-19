import { defineNuxtPlugin } from '#app';
import { decodeJwt } from 'jose';
import axios from 'axios';
import { setToken } from '~/services/tokenService';

export default defineNuxtPlugin((nuxtApp) => {
    const baseURL = useRuntimeConfig().public.API_BACKEND;
    const showToastfy = inject("showToastify");
    const router = useRouter();
    const loading = useState('loading', () => false);

    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 15000, 
    });

    axiosInstance.interceptors.request.use(config => {
        loading.value = true; 
        
        const token = sessionStorage.getItem('token');

        if (token) {
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
        if (response.config.url.includes('/report/generate') || response.config.url.includes('report/generate')) {
            if(response.data.MsgAlerta !== "" && response.data.response === "" ) return showToastfy(response.data.msgAlerta, "warning");
            return response.data
        };
        if(response.data.msgSucesso !== "") showToastfy(response.data.msgSucesso, "success");
        else if(response.data.msgAlerta !== "") showToastfy(response.data.msgAlerta, "warning");
        return response.data.response;
    }, error => {
        loading.value = false;

        if (error.code === 'ECONNABORTED') showToastfy("A requisição demorou demais. Tente novamente.", "error");

        if(error?.response?.data?.msgErro) showToastfy(error?.response?.data?.msgErro, "error");
        
        if(error?.response?.status === 403) {
            showToastfy("Por favor, efetue novamente o login!", "error");
            removeToken();
            setTimeout(() => {
                router.push('/login');
            }, 1000 * 5);
        }
        
        return Promise.reject(error);
    });

    nuxtApp.vueApp.provide('axios', axiosInstance);
    nuxtApp.provide('axios', axiosInstance);
    nuxtApp.vueApp.provide('loading', loading);
});
