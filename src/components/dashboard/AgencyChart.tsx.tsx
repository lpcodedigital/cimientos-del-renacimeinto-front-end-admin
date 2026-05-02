import React from "react";
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

    // Inyectamos el color directamente en cada objeto de la data
    const chartData = Object.entries(data)
        .map(([name, value], index) => ({
            name,
            total: value,
            fill: COLORS[index % COLORS.length], // <-- El color vive en el dato
        }))
        .sort((a, b) => b.total - a.total);

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                height: 450, // Aumentamos un poco el alto para dar aire
            }}
        >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#023047" }}>
                Obras por Dependencia Ejecutora
            </Typography>
            
            <Box sx={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
                        <XAxis type="number" hide /> 
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={160} 
                            tick={{ fontSize: 11, fill: '#666' }}
                        />
                        <Tooltip 
                            cursor={{ fill: "#f0f0f0" }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
            dataKey="total" 
            radius={[0, 4, 4, 0]} 
            barSize={28}
            // Al no pasarle fill al Bar, buscará la propiedad 'fill' dentro de cada objeto de data
            label={{ position: 'right', fill: '#023047', fontSize: 12, fontWeight: 'bold' }}
        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};