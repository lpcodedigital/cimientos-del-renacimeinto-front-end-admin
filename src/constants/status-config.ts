import { ChipProps } from "@mui/material";

export interface StatusConfig {
    label: string;
    chipColor: ChipProps["color"]; // Para los Tags de MUI
    chartColor: string;            // Para Recharts (Dona)
}

export const OBRA_STATUS_CONFIG: Record<string, StatusConfig> = {
    FINALIZADA: { 
        label: "Finalizada", 
        chipColor: "success", 
        chartColor: "#2e7d32" // Verde oscuro success
    },
    EN_PROCESO: { 
        label: "En Proceso", 
        chipColor: "info", 
        chartColor: "#0288d1" // Azul info
    },
    INICIADA: { 
        label: "Iniciada", 
        chipColor: "primary", 
        chartColor: "#1976d2" // Azul primary
    },
    PLANEACION: { 
        label: "Planeación", 
        chipColor: "warning", 
        chartColor: "#ed6c02" // Naranja warning
    },
    SUSPENDIDA: { 
        label: "Suspendida", 
        chipColor: "warning", 
        chartColor: "#fbc02d" // Amarillo ámbar
    },
    DETENIDA: { 
        label: "Detenida", 
        chipColor: "error", 
        chartColor: "#d32f2f" // Rojo error
    },
    CANCELADA: { 
        label: "Cancelada", 
        chipColor: "error", 
        chartColor: "#c62828" // Rojo más oscuro
    },
    NO_INICIADA: { 
        label: "No Iniciada", 
        chipColor: "secondary", 
        chartColor: "#9c27b0" // Morado secondary
    },
    CERRADA: { 
        label: "Cerrada", 
        chipColor: "default", 
        chartColor: "#757575" // Gris default
    },
};

// Configuración de respaldo por seguridad
export const DEFAULT_STATUS_CONFIG: StatusConfig = {
    label: "Desconocido",
    chipColor: "default",
    chartColor: "#e0e0e0", // Gris muy claro
};