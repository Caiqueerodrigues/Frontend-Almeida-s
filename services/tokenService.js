import { decodeJwt } from "jose";
import axios from 'axios';

let refreshTimeout = null;
let refreshPromise = null;

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
    clearRefresh();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
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
    refreshTimeout = setTimeout(() => {
        refreshToken().catch(() => removeToken());
    }, timeout);
}

export const refreshToken = async () => {
    if (refreshPromise) return refreshPromise;

    const token = localStorage.getItem("refreshToken") || localStorage.getItem("token");
    const config = useRuntimeConfig();
    const apiBackend = config.public.API_BACKEND;

    if (!token) {
        throw new Error("Refresh token não encontrado");
    }

    const axiosInstance = axios.create({
        baseURL: apiBackend,
        timeout: 1000 * 20,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    refreshPromise = (async () => {
        const response = await axiosInstance.get('/users/refresh-token');
        const newToken = response?.data?.response;

        if (!newToken || typeof newToken !== 'string') {
            throw new Error("Resposta inválida ao renovar token");
        }

        setToken(newToken);
        return newToken;
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

const clearRefresh = () => {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = undefined;
    }
}
