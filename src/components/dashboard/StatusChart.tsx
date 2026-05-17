import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { OBRA_STATUS_CONFIG, DEFAULT_STATUS_CONFIG } from "../../constants/status-config";

interface StatusChartProps {
    data: Record<string, number>;
}

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
    const [isMounted, setIsMounted] = useState(false);

    console.log(data);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const chartData = useMemo(() => {
        return Object.entries(data).map(([key, value]) => {
            const config = OBRA_STATUS_CONFIG[key] || DEFAULT_STATUS_CONFIG;
            return {
                statusKey: key, // Guardamos la clave original para referencia interna
                name: config.label || key.replace("_", " "), // Etiqueta legible para la leyenda
                cantidad: value,
                color: config.chartColor, // Usamos 'color' internamente
            };
        });
    }, [data]);

    return (
        <Card sx={{ 
            p: 3, 
            borderRadius: 2, 
            height: "100%", // Importante para que Grid2 lo estire
            boxShadow: 3,
            display: "flex",
            flexDirection: "column"
        }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Obras por Estatus
            </Typography>

            <Box sx={{ 
                width: "100%", 
                flexGrow: 1, // Toma todo el espacio disponible del Card
                height: 320, // Altura mínima garantizada
                position: "relative"
            }}>
                {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius="60%" // Usar porcentajes ayuda a la responsividad
                                outerRadius="80%"
                                paddingAngle={5}
                                dataKey="cantidad"
                                nameKey="statusKey" // Usamos la clave original para evitar problemas de renderizado
                                cx="50%" // Centrado horizontal
                                cy="50%" // Centrado vertical
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                            // Formateador para mostrar el label legible del estatus en el Tooltip en lugar del statusKey
                                formatter={(value: any, name: any, props: any) => [value, props.payload.name]}
                                contentStyle={{ 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                                }}
                            />
                            {/* Una sola leyenda, centrada abajo */}
                            <Legend 
                                verticalAlign="bottom" 
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ paddingTop: '10px' }}
                                formatter={(value, entry: any) => entry.payload.name}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
};