import { ChipProps } from "@mui/material";

export const OBRA_STATUS_CONFIG: Record<string, { label: string; color: ChipProps["color"]}> = {
    FINALIZADA: { label: "Finalizado", color: "success" },
    EN_PROCESO: { label: "En Progreso", color: "info" },
    NO_INICIADA: { label: "No Iniciado", color: "secondary" },
    SUSPENDIDA: { label: "Suspendido", color: "warning" },
    CANCELADA: { label: "Cancelado", color: "error" },
    PLANEACION: { label: "Planeación", color: "warning" },
    DETENIDA: { label: "Detenida", color: "error" },
    CERRADA: { label: "Cerrada", color: "default" },
    INICIADA: { label: "Iniciada", color: "primary" },
};