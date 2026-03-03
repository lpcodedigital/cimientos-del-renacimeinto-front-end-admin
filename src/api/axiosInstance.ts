import axios from 'axios';
import { API_URL,TOKEN_KEY, USER_KEY} from "../providers/constants";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Interceptor para agregar el token de autenticación a cada solicitud
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
            return config;

    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación (e.g., token expirado)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
        return Promise.reject(error);
    }
);

export {axiosInstance};