import { DataProvider } from "@refinedev/core"; // Importante: tipo en SINGULAR
import * as restModule from "@refinedev/rest";
import { axiosInstance } from "../api/axiosInstance";

/* Helper para extraer ña función constructura del módulo de refine.
   esto resuelve el problema de empaquetado de Vite 
*/
const getRestProviderFunction = () => {
    // Caso 1: Es la exportación por defecto (más común en Vite)
    if (typeof (restModule as any).default === "function") {
        //console.log("Caso #1");
        
        return (restModule as any).default;
    }
    // Caso 2: El módulo en sí mismo es la función (CommonJS)
    if (typeof restModule === "function") {
      //console.log("Caso #2");
        return restModule;
    }
    // Caso 3: Está exportado como un miembro nombrado (raro, pero posible)
    if (typeof (restModule as any).dataProvider === "function") {
        //console.log("Caso #3");
        return (restModule as any).dataProvider;
    }
    // Caso 4: Intentar buscar cualquier función dentro del objeto
    const keys = Object.keys(restModule);
    for (const key of keys) {
        if (typeof (restModule as any)[key] === "function") {
            //console.log("Caso #4");
            return (restModule as any)[key];
        }
    }
    throw new Error("No se pudo encontrar la función constructora en @refinedev/rest");
};

const restProviderFunc = getRestProviderFunction();

// Inicializamos el dataProvider con la función constructora obtenida, pasando la URL base y la instancia de Axios
const baseDataProvider = restProviderFunc(
  axiosInstance.defaults.baseURL as string,
  axiosInstance
);

// Al pasarle 'axiosInstance', CUALQUIER método que use Refine (getList, getOne, create, etc.)
// pasará primero por el interceptor de Axios y llevará el Token automáticamente.
export const dataProvider: DataProvider = {
  //axiosInstance.defaults.baseURL as string,
  //axiosInstance

    ...baseDataProvider,
    getList: async ( {resource, pagination, filters, sorters, meta}) => {
      const { currentPage: current = 1, pageSize = 10 } = pagination ?? {};

      // APLICANDO CLEAN ARCHITECTURE: Convención sobre configuración
      // 1. Prioriza el endpoint definido en el componente (vía meta).
      // 2. Si no existe, usa la convención estándar 'list'.
      const endpoint = meta?.endpoint ?? "list";
      const url = `${resource}/${endpoint}`;

      const { data } = await axiosInstance.get(url,{
        params: {
          page: current - 1, // Ajuste para que el backend reciba un índice basado en cero
          size: pageSize,
          // Aquí podrías agregar lógica para convertir 'filters' y 'sorters' en parámetros de consulta si tu backend los soporta
        },
      });

      return {
        data: data.content, // Asumiendo que el backend devuelve un objeto con una propiedad 'content' que contiene la lista de obras
        total: data.totalElements, // Asumiendo que el backend devuelve un objeto con una propiedad 'totalElements' que indica el total de obras disponibles
      };

    },
    getOne: async({resource, id, meta}) => {

      const endpoint = meta?.endpoint ?? "detail";
      const url = `${resource}/${endpoint}/${id}`;
      
      const { data } = await axiosInstance.get(url);

      return { data };
    },
  };
