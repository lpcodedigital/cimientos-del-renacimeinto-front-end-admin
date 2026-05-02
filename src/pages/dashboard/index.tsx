import React from "react";
import { StatCard } from "../../components/dashboard/StatCard";
import { useDashboardStats } from "../../hooks/dashboard/useDashboardStats"
import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { MunucipalityChart } from "../../components/dashboard/MunucipalityChart";
import { StatusChart } from "../../components/dashboard/StatusChart";
import { Navigate } from "react-router";
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import { AgencyChart } from "../../components/dashboard/AgencyChart.tsx";
import BusinessIcon from '@mui/icons-material/Business';

export const DashboardPage: React.FC = () => {

    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr || "{}");

    if (user.isFirstLogin) {
        return <Navigate to="/update-password" replace />;
    }

    const { query } = useDashboardStats();
    const { data: response, isLoading, isError } = query;

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return <Typography color="error" sx={{ p: 3 }}>Error al conectar con el servidor de Mérida.</Typography>;
    }

    const stats = response?.data;

    return (
        <Box
            sx={{
                p: 3,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: "#023047"
                }}
            >
                Cimientos del Renacimiento
            </Typography>

            {/* Usamos disableEqualOverflow para ayudar con los márgenes del Grid */}
            <Grid2 container spacing={3} sx={{
                    width: "100%",
                    margin: 0 // 2. Forzamos a que el grid no se salga de su contenedor
                }}>
                
                {/* --- SECCIÓN OBRAS (4 tarjetas que suman 12 en MD) --- */}
                
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Ejecutoras"
                        value={stats?.totalAgency.toString() || "0"} // Corregido: totalAgencies
                        icon={<BusinessIcon color="warning" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Obras Activas"
                        value={stats?.totalObras.toString() || "0"}
                        icon={<AccountTreeIcon color="info" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Cobertura"
                        value={`${stats?.municipalitiesWithObras} / 106`}
                        icon={<MapIcon color="primary" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Capacitación"
                        value={stats?.totalCursos.toString() || "0"}
                        icon={<SchoolIcon color="secondary" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                {/* --- SECCIÓN SOCIAL --- */}
                <Grid2 size={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Gestión y Usuarios</Typography>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <StatCard
                        title="Usuarios Totales"
                        value={stats?.totalUsers.toString() || "0"}
                        icon={<PeopleIcon color="primary" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <StatCard
                        title="Personal Activo"
                        value={`${stats?.activeUsers} / ${stats?.totalUsers}`}
                        icon={<PeopleIcon color="success" sx={{ fontSize: 40 }} />}
                    />
                </Grid2>

                {/* --- FILA 2: GRÁFICAS --- */}
                <Grid2 size={{ xs: 12, lg: 8 }}>
                    {stats?.countByMunicipality && (
                        <MunucipalityChart data={stats.countByMunicipality} />
                    )}
                </Grid2>

                <Grid2 size={{ xs: 12, lg: 4 }}>
                    {stats?.countByStatus && (
                        <StatusChart data={stats.countByStatus} />
                    )}
                </Grid2>

                {/* --- FILA 3: ANÁLISIS DE EJECUTORAS --- */}
                <Grid2 size={12}>
                    <AgencyChart data={stats?.countByAgency || {}} />
                </Grid2>
            </Grid2>
        </Box>
    );
};