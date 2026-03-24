import { Box, Card, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip } from "recharts";
import { OBRA_STATUS_CONFIG, DEFAULT_STATUS_CONFIG } from "../../constants/status-config";

interface StatusChartProps {
    data: Record<string, number>;
}
export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {

    const [isMounted, setIsMounted] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    //const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

    const COLORS = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
    ];

    const chartData = useMemo(() => {
    return Object.entries(data).map(([name, value]) => {
      // Obtenemos la configuración completa para este estatus
      const config = OBRA_STATUS_CONFIG[name] || DEFAULT_STATUS_CONFIG;
      
      return {
        name: config.label, // Usamos la etiqueta bonita (ej: "Finalizada")
        cantidad: value,
        fill: config.chartColor, // <--- AQUÍ ESTÁ LA MAGIA: Color único por estatus
      };
    });
  }, [data]);

    return (
        <Card sx={{ p: 3, borderRadius: 2, height: "100%", boxShadow: 3 }}>
            {/* ... Título y Box ... */}
            {/* ... Título y Box ... */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Obras por Estatus
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
                <ResponsiveContainer 
                    width="99%" 
                    aspect={2} // samos aspect (relación ancho/alto, ej: 2 significa que es el doble de ancho que de alto)
                >
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="cantidad"
                            nameKey="name"
                        // Recharts buscará automáticamente la propiedad 'fill' en cada objeto de chartData
                        />
                        <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
                        <Legend />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
};