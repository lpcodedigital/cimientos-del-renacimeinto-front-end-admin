import React from "react";
import { StatCard } from "../../components/dashboard/StatCard";
import { useDashboardStats } from "../../hooks/dashboard/useDashboardStats"
import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import SpeedIcon from '@mui/icons-material/Speed';
import PaidIcon from '@mui/icons-material/Paid';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { MunucipalityChart } from "../../components/dashboard/MunucipalityChart";
import { StatusChart } from "../../components/dashboard/StatusChart";

export const DashboardPage: React.FC = () => {

    // 1. Llamamos al hook y extraemos query
    const { query } = useDashboardStats();

    // 2. Extremos la data y los estados de carga de query
    const { data: response, isLoading, isError } = query;

    // 3. Manejo de estados de carga y error (SOLID: Robustez)
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return <Typography color="error">Error al conectar con el servidor de Mérida.</Typography>;
    }

    // 4. Extraemos los stats. 
    // 'response' es la respuesta de React Query, 'data.data' es tu DashboardStatsDTO del Backend.
    const stats = response?.data;

    return (
        <Box
            sx={{
                p: 3
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 'bold'
                }}
            >
                Cimientos del Renacimiento
            </Typography>

            <Grid2
                container
                spacing={3}
            >
                {/* --- FILA 1: KPI CARDS --- */}
                <Grid2
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >
                    <StatCard
                        title="Inversión Total"
                        value={`$${stats?.totalInvestment.toLocaleString()}`}
                        icon={<PaidIcon color="success" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                <Grid2
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >
                    <StatCard
                        title="Obras Activas"
                        value={stats?.totalObras.toString() || "0"}
                        icon={<AccountTreeIcon color="info" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                <Grid2
                    size={{
                        xs: 12,
                        md: 4
                    }}
                >
                    <StatCard
                        title="Avance General"
                        value={`${stats?.averageProgress.toFixed(1)}%`}
                        icon={<SpeedIcon color="warning" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                {/* --- FILA 2: GRÁFICAS --- */}
                {/* Gráfica de Barras - Ocupa 8 columnas en pantallas grandes */}
                <Grid2 size={{ xs: 12, lg: 8 }}>
                    {stats?.countByMunicipality && (
                        <MunucipalityChart data={stats.countByMunicipality} />
                    )}
                </Grid2>

                {/* Gráfica de Dona - Ocupa 4 columnas */}
                <Grid2 size={{ xs: 12, lg: 4 }}>
                    {stats?.countByStatus && (
                        <StatusChart data={stats.countByStatus} />
                    )}
                </Grid2>


            </Grid2>
        </Box>

    );
}