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
                height: 380, 
                minHeight: 350, 
                display: "flex", 
                flexDirection: "column", 
                // Esto asegura que el contenedor tenga dimensiones ANTES de que Recharts las pida
                contain: "layout size",
            }}>
                {isMounted && (
                    // 3. Solo renderiza si ya estamos montados
                    <ResponsiveContainer 
                        width="100%"
                        height="100%" 
                        >
                        <BarChart 
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 45 }} // 💡 Margen inferior amplio para los textos rotados
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                            {/* 💡 Rotamos los textos -45 grados y los alineamos para que quepan perfectamente en cualquier pantalla */}
                            <XAxis 
                                dataKey="name" 
                                fontSize={11} 
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                interval={0} // 💡 Fuerza a Recharts a mostrar TODOS los municipios sin saltarse ninguno
                                stroke={theme.palette.text.secondary}
                            />
                            <YAxis 
                                fontSize={11} 
                                tickLine={false}
                                axisLine={false}
                                stroke={theme.palette.text.secondary}
                            />
                            <Tooltip cursor={{ fill: theme.palette.action.hover }} />

                            {/* 2. El Bar ahora toma el color directamente de la propiedad 'fill' del dato */}
                            <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>

        </Card>
    );

}