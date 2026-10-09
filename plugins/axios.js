import { defineNuxtPlugin } from '#app';
import axios from 'axios';
import { refreshToken, removeToken } from '~/services/tokenService';

export default defineNuxtPlugin((nuxtApp) => {
    const baseURL = useRuntimeConfig().public.API_BACKEND;
    const showToastfy = inject("showToastify");
    const router = useRouter();
    const loading = useState('loading', () => false);
    let redirectingToLogin = false;

    const logout = async () => {
        removeToken();

        if (redirectingToLogin) return;
        redirectingToLogin = true;
        showToastfy("Sua sessão expirou. Efetue novamente o login!", "error");
        await router.push('/login');
        redirectingToLogin = false;
    };

    const axiosInstance = axios.create({
        baseURL: baseURL,
        timeout: 1000 * 20, 
    });

    axiosInstance.interceptors.request.use(config => {
        loading.value = true; 
        
        const token = import.meta.client ? localStorage.getItem('token') : null;

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

        const originalRequest = error?.config;
        const status = error?.response?.status;
        const isAuthenticationError = status === 401 || status === 403;
        const isRefreshRequest = originalRequest?.url?.includes('/users/refresh-token');
        const hasRefreshToken = import.meta.client && Boolean(
            localStorage.getItem('refreshToken') || localStorage.getItem('token')
        );

        if (isAuthenticationError && hasRefreshToken && !isRefreshRequest && !originalRequest?._retry) {
            originalRequest._retry = true;

            return refreshToken()
                .then(newToken => {
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                })
                .catch(async refreshError => {
                    await logout();
                    return Promise.reject(refreshError);
                });
        }

        if (isAuthenticationError) {
            logout();
            return Promise.reject(error);
        }

        if (error.code === 'ECONNABORTED') showToastfy("A requisição demorou demais. Tente novamente.", "error");

        if (error?.response?.status === 429) {
            const retryAfter = Number(error.response.headers?.['retry-after']);
            const waitingTime = Number.isFinite(retryAfter) && retryAfter > 0
                ? `${retryAfter} segundo${retryAfter === 1 ? '' : 's'}`
                : 'alguns instantes';
            showToastfy(`Limite de requisições atingido. Aguarde ${waitingTime} e tente novamente.`, "warning");
            return Promise.reject(error);
        }

        if(error?.response?.data?.msgErro) showToastfy(error?.response?.data?.msgErro, "error");
        
        return Promise.reject(error);
    });

    nuxtApp.vueApp.provide('axios', axiosInstance);
    nuxtApp.provide('axios', axiosInstance);
    nuxtApp.vueApp.provide('loading', loading);
});
