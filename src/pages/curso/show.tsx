import React from "react";
import { Show, DateField } from "@refinedev/mui";
import { useShow } from "@refinedev/core";
import { 
    Typography, Stack, Box, Grid2, Paper, Divider, 
    ImageList, ImageListItem, Chip 
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { CursoResponseDTO } from "../../interfaces/curso/curso";

export const CursoShow = () => {
    const { query } = useShow<CursoResponseDTO>({
        
        meta: {
            endpoint: "detail", // Coincide con tu @GetMapping("/show/{id}")
        }
    });

    const { data, isLoading } = query;
    const record = data?.data;

    return (
        <Show isLoading={isLoading} title={`Detalles del Curso: ${record?.title || ""}`}>
            <Grid2 container spacing={4}>
                
                {/* COLUMNA IZQUIERDA: Información y Descripción */}
                <Grid2 size={{ xs: 12, md: 7 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                {record?.title}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <Chip 
                                    icon={<LocationOnIcon />} 
                                    label={record?.municipalityName} 
                                    variant="outlined" 
                                    color="secondary"
                                />
                                <Chip 
                                    icon={<CalendarMonthIcon />} 
                                    label={<DateField value={record?.courseDate} format="DD/MM/YYYY" />} 
                                    variant="outlined"
                                />
                            </Stack>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Descripción del Curso
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-line", color: "text.secondary" }}>
                                {record?.description}
                            </Typography>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                            <Typography variant="caption" color="textSecondary" display="block">
                                ID del Registro: {record?.id}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                                Creado por: {record?.createdBy}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Última actualización: {new Date(record?.updatedAt || "").toLocaleString()}
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid2>

                {/* COLUMNA DERECHA: Portada y Galería */}
                <Grid2 size={{ xs: 12, md: 5 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Portada
                    </Typography>
                    <Box 
                        component="img"
                        src={record?.coverImage?.url || "/default-course.png"}
                        sx={{ 
                            width: "100%", 
                            maxHeight: 300, 
                            objectFit: "cover", 
                            borderRadius: 2,
                            boxShadow: 3,
                            mb: 4
                        }}
                    />

                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Galería de Imágenes ({record?.images?.length || 0})
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1, maxHeight: 400, overflowY: "auto" }}>
                        {record?.images && record.images.length > 0 ? (
                            <ImageList variant="masonry" cols={2} gap={8}>
                                {record.images.map((img) => (
                                    <ImageListItem key={img.id}>
                                        <img
                                            src={`${img.url}?w=248&fit=crop&auto=format`}
                                            alt="Evidencia"
                                            loading="lazy"
                                            style={{ borderRadius: "4px", cursor: "pointer" }}
                                            onClick={() => window.open(img.url, "_blank")}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: "center" }}>
                                No hay imágenes adicionales en la galería.
                            </Typography>
                        )}
                    </Paper>
                </Grid2>
            </Grid2>
        </Show>
    );
};