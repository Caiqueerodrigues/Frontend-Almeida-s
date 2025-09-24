import { decodeJwt } from "jose";
import axios from 'axios';

let refreshTimeout = null;

export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        return !!token;
    }
};

export const tokenValido = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const decoded = decodeJwt(token);

            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                localStorage.removeItem("token");
                return false;
            }
            return true;
        } catch (err) {
            localStorage.removeItem("token");
            return false;
        }
    }
    return false;
};

const tokenDecoded = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (!token) return "";

        try {
            const decoded = decodeJwt(token);
            
            if(!refreshTimeout) agendamentoRefresh(token)
            return decoded;
        } catch (err) {
            return false;
        }
    }
}

export const usernameToken = () => {
    const user = tokenDecoded();
    if (user) {
        return user.name;
    }
}

export const idUserToken = () => {
    const user = tokenDecoded();
    if (user) {
        return user.id;
    }
}

export const tokenUserData = () => {
    const user = tokenDecoded();
    if(user) {
        try {            
            return user;
        } catch (err) {
            return false;
        }
    }
}

export const removeToken = () => {
    localStorage.removeItem('token');
    setNewPhotoToken('global.png');
}

export const setToken = (data) => {
    localStorage.setItem('token', data);
    const decoded = decodeJwt(data);
    setNewPhotoToken(decoded?.photo);
    agendamentoRefresh(data);
}

export const setNewPhotoToken = (nome) => {
    photoPathPrivate.value = nome;
}

let photoPathPrivate = ref(tokenDecoded()?.photo ?? 'global.png');

export const photoPath = () => {
    return photoPathPrivate.value;
}

const agendamentoRefresh = (token) => {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return;

    const expiration = payload.exp;
    const now = Date.now() / 1000;
    const skew = 30; // 30s antes do expirar
    const timeout = Math.max(((expiration - now) - skew) * 1000, 0);

    clearRefresh();
    refreshTimeout = setTimeout(() => refreshToken(), timeout);
}

const refreshToken = async () => {
    const token = localStorage.getItem("token");
    const config = useRuntimeConfig();
    const apiBackend = config.public.API_BACKEND;

    if (!token) {
        console.error("Token não encontrado!");
        return;
    }

    const axiosInstance = axios.create({
        baseURL: apiBackend,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    try {
        const response = await axiosInstance.get('/users/refresh-token');
        setToken(response.data.response);
        agendamentoRefresh(response.data.response);
    } catch (error) {
        console.error(error);
    }
}

const clearRefresh = () => {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = undefined;
    }
}