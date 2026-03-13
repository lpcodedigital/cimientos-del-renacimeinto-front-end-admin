import { useShow } from "@refinedev/core";
import React from "react";
import { ObraResponseDTO } from "../../interfaces/obra";
import { DateField, NumberField, Show } from "@refinedev/mui";
import { Box, Card, CardContent, Grid, Grid2, LinearProgress, Skeleton, Stack, Typography } from "@mui/material";
import { StatusTag } from "../../components/obras/StatusTag";
import { ObraImageGallery } from "../../components/obras/ObraImageGallery";
import { MapPicker } from "../../components/obras/MapPicker";

export const ObraShow: React.FC = () => {

    // El Hook useShow se encarga de llamar automaticamente a dataProvider.getOne() con el id de la URL y manejar el estado de carga, error y datos
    const { query } = useShow<ObraResponseDTO>({
        meta: {
            endpoint: "detail"
        },
    });

    const { data, isLoading, isError } = query;
    const record = data?.data; // El objeto de la obra obtenida de la API, con toda su información detallada.

    // Validar si ocurrió un error al cargar la obra, y mostrar un mensaje amigable en caso de que así sea.
    if (isError) {
        return (
            <Box sx={{ p: 2, bgcolor: "error.main", color: "white", borderRadius: 2 }}>
                <Typography variant="h6">Error al cargar la obra</Typography>
                <Typography variant="body2">Inténtalo de nuevo más tarde.</Typography>
            </Box>
        );
    }

    return (
        <Show isLoading={isLoading} title={<Typography variant="h5">Detalle de la obra #{record?.id}</Typography>}>
            <Grid2 container spacing={3}>

                {/** Panel Izquierdo: Información de la obra */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="overline" color="text.secundary">Nombre de la obra</Typography>
                            <Typography variant="h4" fontWeight={700}>{record?.name}</Typography>
                        </Box>

                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs:6 }}>
                                <Typography variant="overline">Municipio</Typography>
                                <Typography variant="body1">{record?.municipality}</Typography>
                            </Grid2>
                            <Grid2 size={{ xs:6 }}>
                                <Typography variant="overline">Estado</Typography>
                                <Box>
                                    <StatusTag status={record?.status || ""}/>
                                </Box>
                            </Grid2>
                        </Grid2>

                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Inversión y Avance</Typography>
                                <Typography variant="body2" color="text.secundary">Agencia Ejecutora: {record?.agency}</Typography>

                                <Box sx={{ my:2 }}>
                                    <Typography variant="body2" color="text.secundary">Progreso: {record?.progress}%</Typography>
                                    <LinearProgress variant="determinate" value={record?.progress || 0} />
                                </Box>

                                <Typography variant="h5" color="primary.main" fontWeight={700}>
                                    <NumberField
                                        value={record?.investment || 0}
                                        options={{ style: "currency", currency: "MXN" }}
                                    />
                                </Typography>
                            </CardContent>
                        </Card>

                        <Box>
                            <Typography variant="h6" gutterBottom>Descripción</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap"}}>
                                {record?.description || "No hay descripción disponible para esta obra."}
                            </Typography>
                        </Box>

                        <Grid2
                            size={{
                                xs: 12,
                            }}
                        >
                            <Typography>
                                Ubicación geográfica de la obra
                            </Typography>

                            {/* Esta validación es para que no se muestre el mapa hasta que la obra tenga coordenadas */}
                            { record ? (
                                    <MapPicker
                                        lat={record?.latitude}
                                        lng={record?.longitude}
                                    />
                            ) : (
                                <Skeleton variant="rectangular" height={400} />
                            )}
                        </Grid2>
                    </Stack>
                </Grid2>

                {/** Panel Derecho: Galería de imágenes */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Typography>Evidencia Fotográfica</Typography>
                        <ObraImageGallery images={record?.images || []}/>

                        <Card sx={{ bgcolor: "grey.50" }}>
                            <CardContent>
                                <Typography variant="subtitle2" gutterBottom>Información de Control (Auditoria)</Typography>
                                <Stack spacing={1}>
                                    <Typography variant="caption">
                                        Creado por: <strong>{record?.createdBy || "Desconocido"}</strong>
                                    </Typography>
                                    <Typography>
                                        Fecha: <DateField value={record?.createdAt || ""} format="LLL"/>
                                    </Typography>
                                </Stack>

                            </CardContent>
                        </Card>
                    </Stack>
                </Grid2>

            </Grid2>
        </Show>
    );
}