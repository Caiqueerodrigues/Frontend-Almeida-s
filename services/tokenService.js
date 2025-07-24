import { decodeJwt } from "jose";

export const isLoggedIn = () => {
    if (process.client) {
        const token = sessionStorage.getItem("token");
        return !!token;
    }
};

export const tokenValido = () => {
    if (process.client) {
        const token = sessionStorage.getItem("token");
        if (!token) return false;

        try {
            const decoded = decodeJwt(token);

            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                sessionStorage.removeItem("token");
                return false;
            }
            return true;
        } catch (err) {
            sessionStorage.removeItem("token");
            return false;
        }
    }
    return false;
};

const tokenDecoded = () => {
    if (process.client) {
        const token = sessionStorage.getItem("token");
        if (!token) return "";

        try {
            const decoded = decodeJwt(token);
            
            return decoded;
        } catch (err) {
            sessionStorage.removeItem("token");
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