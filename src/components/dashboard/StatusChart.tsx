import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { OBRA_STATUS_CONFIG, DEFAULT_STATUS_CONFIG } from "../../constants/status-config";

interface StatusChartProps {
    data: Record<string, number>;
}

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
    const [isMounted, setIsMounted] = useState(false);

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

    // Calculamos el total general de obras en el Frontend para sacar las proporciones
    const totalObras = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.cantidad, 0);
    }, [chartData]);

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
                height: 380, // Altura mínima garantizada
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
                                // 💡 2. Formateador del Tooltip: Muestra la cantidad y el porcentaje calculado al pasar el cursor
                                formatter={(value: any, _name: any, props: any) => {
                                    const porcentaje = totalObras > 0 ? ((value / totalObras) * 100).toFixed(1) : 0;
                                    return [
                                        `${value} obras (${porcentaje}%)`, 
                                        props.payload.name
                                    ];
                                }}
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
                                wrapperStyle={{ paddingTop: '15px' }}
                                // 💡 3. Formateador de Leyenda: Añade el porcentaje al lado del nombre (Ej: "PLANEACIÓN (15.5%)")
                                formatter={(_value, entry: any) => {
                                    const itemData = entry.payload;
                                    const porcentaje = totalObras > 0 ? ((itemData.cantidad / totalObras) * 100).toFixed(1) : 0;
                                    return (
                                        <span style={{ color: "#333", fontSize: "12px" }}>
                                            {itemData.name} **({porcentaje}%)**
                                        </span>
                                    );
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
};