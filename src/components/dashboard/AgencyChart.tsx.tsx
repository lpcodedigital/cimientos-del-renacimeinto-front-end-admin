import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Box, Paper, Typography } from "@mui/material";

interface AgencyChartProps {
    data: Record<string, number>;
}

export const AgencyChart: React.FC<AgencyChartProps> = ({ data }) => {
    const COLORS = ["#023047", "#219ebc", "#8ecae6", "#d4a373", "#faedcd"];

    const chartData = useMemo(() => {
        return Object.entries(data)
            .map(([name, value], index) => ({
                name,
                total: value,
                fill: COLORS[index % COLORS.length],
            }))
            .sort((a, b) => b.total - a.total);
    }, [data]);

    // 💡 PASO CLAVE: Si hay muchas agencias, aumentamos proporcionalmente la altura del Box
    // para que las 17 barras respiren y no se aplasten.
    const dynamicHeight = useMemo(() => {
        return Math.max(chartData.length * 35, 380);
    }, [chartData]);

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold", color: "#023047" }}>
                Obras por Dependencia Ejecutora
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                Clasificación de proyectos según la entidad responsable
            </Typography>
            
            {/* Contenedor con scroll vertical si la lista de agencias llegase a ser masiva */}
            <Box sx={{ 
                width: "100%", 
                maxHeight: 500, // Altura máxima en el Dashboard
                overflowY: "auto", 
                pr: 1 
            }}>
                <Box sx={{ width: "100%", height: dynamicHeight }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 45, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#eee" />
                            <XAxis type="number" hide /> 
                            
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={180} // 💡 Ampliamos el espacio para los nombres de las dependencias
                                tick={{ fontSize: 10, fill: '#555' }}
                                tickLine={false}
                                axisLine={false}
                                // 💡 Formateador inteligente: Si el nombre es muy largo, lo recorta con puntos suspensivos
                                tickFormatter={(value) => value.length > 28 ? `${value.substring(0, 25)}...` : value}
                            />
                            
                            <Tooltip 
                                cursor={{ fill: "#f4f4f4" }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            
                            <Bar 
                                dataKey="total" 
                                radius={[0, 4, 4, 0]} 
                                barSize={18} // 💡 Reducimos un poco el grosor para dar elegancia
                                label={{ position: 'right', fill: '#023047', fontSize: 11, fontWeight: 'bold', offset: 8 }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Paper>
    );
};