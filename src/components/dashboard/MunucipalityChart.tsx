import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, Tooltip, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Box, Card, Typography, useTheme } from "@mui/material";

interface MunucipalityChartProps {
    data: Record<string, number>;
}
export const MunucipalityChart: React.FC<MunucipalityChartProps> = ({ data }) => {

    const [isMounted, setIsMounted] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const COLORS = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
    ];

    const chartData = useMemo(() => {
        return Object.entries(data).map(([name, value], index) => ({
            name,
            cantidad: value,
            fill: COLORS[index % COLORS.length], // Asignar color basado en el índice
        }));
    }, [data, COLORS]);

    return (
        <Card sx={{ p: 3, borderRadius: 2, height: "100%", boxShadow: 3 }}>
            {/* ... Título y Box ... */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Obras por Municipio
            </Typography>

            {/* 2. El contenedor DEBE tener una altura fija para que el Chart sepa cuánto medir */}
            <Box sx={{ 
                width: "100%", 
                height: 350, 
                minHeight: 350, 
                display: "flex", 
                flexDirection: "column", 
                // Esto asegura que el contenedor tenga dimensiones ANTES de que Recharts las pida
                contain: "layout size",
            }}>
                {isMounted && (
                    // 3. Solo renderiza si ya estamos montados
                    <ResponsiveContainer 
                        width="99%" 
                        aspect={2} // samos aspect (relación ancho/alto, ej: 2 significa que es el doble de ancho que de alto)
                        >
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip cursor={{ fill: theme.palette.action.hover }} />

                            {/* 2. El Bar ahora toma el color directamente de la propiedad 'fill' del dato */}
                            <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} barSize={35} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>

        </Card>
    );

}