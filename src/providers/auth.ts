import type { AuthProvider } from "@refinedev/core";
import { axiosInstance } from "../api/axiosInstance";
import { TOKEN_KEY, USER_KEY } from "./constants";
import { LoginResponse } from "../interfaces/auth";

export const authProvider: AuthProvider = {

  // Manejo del login: Envía una solicitud al backend para autenticar al usuario
  login: async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", { email, password });

      localStorage.setItem(TOKEN_KEY, data.token);

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return { success: true, redirectTo: "/" };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.response?.data?.message || "Crendenciales inválidas",
        }
      }
    }
  },

  // Manejo del logout: Elimina el token y la información del usuario del almacenamiento local
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  // Verifica si el usuario está autenticado (Se llama en cada cambio de ruta)
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? {authenticated: true } : { authenticated: false, redirectTo: "/login" };
  },

  // Obtiene los permisos del usuario (en este caso, el rol) para controlar el acceso a ciertas partes de la aplicación
  getPermissions: async () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user).role : null;
  },

  // Obtiene la identidad del usuario de JWT
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    if (token) {
      return {
        id: user ? JSON.parse(user).id : "0",
        name: user ? JSON.parse(user).name : "Unknown",
        avatar: user ? JSON.parse(user).avatar : "https://i.pravatar.cc/300",
      };
    }
    return null;
  },

  // Manejo de errores de autenticación: Si el backend responde con un error 401 o 403, se considera que el usuario no está autenticado
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    //console.error(error);
    return {
      logout: false,
    };
  },
};
