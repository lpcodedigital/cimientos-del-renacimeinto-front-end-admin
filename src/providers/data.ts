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
  getList: async ({ resource, pagination, meta }) => {
    const { currentPage: current = 1, pageSize = 10 } = pagination ?? {};

    // APLICANDO CLEAN ARCHITECTURE: Convención sobre configuración
    // 1. Prioriza el endpoint definido en el componente (vía meta).
    // 2. Si no existe, usa la convención estándar 'list'.
    const endpoint = meta?.endpoint ?? "list";
    const url = `${resource}/${endpoint}`;

    const { data } = await axiosInstance.get(url, {
      params: {
        page: current - 1, // Ajuste para que el backend reciba un índice basado en cero
        size: pageSize,
        // Aquí podrías agregar lógica para convertir 'filters' y 'sorters' en parámetros de consulta si tu backend los soporta
      },
    });

    // 1. Si 'data' ya es un array (caso Roles), lo usamos directamente.
    // 2. Si no, buscamos en las propiedades conocidas (caso Obras/Usuarios).
    const isArray = Array.isArray(data);

    return {

      data: isArray ? data : (data.data || data.users || data.content || []),
      total: isArray ? data.length : (data.total || data.totalItems || data.totalElements || 0),

    };

  },

  getOne: async ({ resource, id, meta }) => {

    const endpoint = meta?.endpoint ?? "detail";
    const url = `${resource}/${endpoint}/${id}`;

    const { data } = await axiosInstance.get(url);

    return { data };
  },

  create: async ({ resource, variables, meta }) => {
    const endpoint = meta?.endpoint ?? "create";
    const url = `${resource}/${endpoint}`;

    const typedVariables = variables as any;

    // 1. Detectar si hay archivos en cualquier parte de las variables
    // Buscamos la propiedad 'files' que inyectamos en el handleOnFinish del componente
    const hasFiles = typedVariables.files && Array.isArray(typedVariables.files) && typedVariables.files.length > 0;;

    if (hasFiles) {
      const formData = new FormData();

      // Extraemos 'files' y dejamos el resto en 'restVariables'
      const { files, ...restVariables } = typedVariables;

      // 2. Construir el JSON del DTO (RequestPart "request")
      const jsonBlob = new Blob([JSON.stringify(restVariables)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob);

      // 3. Adjuntar los archivos reales
      files.forEach((file: any) => {
        // Refine/AntD/MUI suelen envolver el archivo en originFileObj
        const actualFile = file.originFileObj || file;

        // Solo adjuntamos si es realmente un objeto File o Blob
        if (actualFile instanceof File || actualFile instanceof Blob) {
          formData.append("files", actualFile);
        }
      });

      // 4. Ejecutar la petición
      const { data } = await axiosInstance.post(url, formData, {
        // IMPORTANTE: transformRequest debe ser nulo para que Axios no toque el FormData
        transformRequest: [(data) => data],
        // No fuerces Content-Type manualmente aquí, deja que el navegador ponga el boundary
      });

      return { data };
    }

    // Si no hay archivos, envío JSON estándar
    const { data } = await axiosInstance.post(url, variables);
    return { data };
  },

  update: async ({ resource, id, variables, meta }) => {
    const endpoint = meta?.endpoint ?? "update";
    const url = `${resource}/${endpoint}/${id}`;

    const typedVariables = variables as any;

    // Detectamos si hay archivos (independiente del recurso)
    const hasFiles = typedVariables.files && Array.isArray(typedVariables.files) && typedVariables.files.length > 0;

    if (resource === "obra" || resource === "curso" || hasFiles) {
      const formData = new FormData();

      // Separamos "files" del resto de campos (incluyendo keepImageIds)
      const { files, ...restVariables } = typedVariables;

      // 1. Crear el DTO como Blob JSON (Parte "request")
      const jsonBlob = new Blob([JSON.stringify(restVariables)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob);

      // 2. Adjuntar archivos nuevos
      if (hasFiles) {
            files.forEach((file: any) => {
                const actualFile = file.originFileObj || file;
                if (actualFile instanceof File || actualFile instanceof Blob) {
                    formData.append("files", actualFile);
                }
            });
        } else {
            // Si solo editaste texto o borraste fotos de la galería sin subir nuevas
            formData.append("files", new Blob([], { type: "application/octet-stream" }), "empty");
        }

      // 3. Ejecutar la petición con PUT
      const { data } = await axiosInstance.put(url, formData, {
        // Evitamos que axios intente serializar el FormData
        transformRequest: [(data) => data],
      });

      return { data };
    }

    // Si no hay archivos, enviamos JSON estándar (Útil para actualizar solo texto)
    const { data } = await axiosInstance.put(url, variables);
    return { data };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const endpoint = meta?.endpoint ?? "delete";
    const url = `${resource}/${endpoint}/${id}`;

    const { data } = await axiosInstance.delete(url, {
      data: variables,

    });

    return { data };
  },

  custom: async ({ url, method, meta, payload }) => {
    const requestUrl = meta?.endpoint ? `${url}/${meta.endpoint}` : url;


    const { data } = await axiosInstance({
      url: requestUrl,
      method: method as any,
      data: payload,
    });

    return { data }
  },
};
