import { decodeJwt } from "jose";

export const isLoggedIn = () => {
    if (process.client) {
        const token = sessionStorage.getItem("user");
        return !!token;
    }
};

export const tokenValido = () => {
    if (process.client) {
        const token = sessionStorage.getItem("user");
        if (!token) return false;

        try {
            const decoded = decodeJwt(token);

            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                sessionStorage.removeItem("user");
                return false;
            }
            return true;
        } catch (err) {
            sessionStorage.removeItem("user");
            return false;
        }
    }
    return false;
};