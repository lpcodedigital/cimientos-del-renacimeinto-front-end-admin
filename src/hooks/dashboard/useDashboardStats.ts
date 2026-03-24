// En useDashboardStats.ts
import { useCustom, CustomResponse } from "@refinedev/core";
import { DashboardStats } from "../../interfaces/dashboard/dashboard";

export const useDashboardStats = () => {
    // Retornamos directamente el resultado de useCustom
    return useCustom<DashboardStats>({
        url: "dashboard",
        method: "get",
        meta: {
            endpoint: "stats"
        }
    });
};