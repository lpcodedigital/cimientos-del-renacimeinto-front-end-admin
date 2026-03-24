import React, { useEffect, useState } from "react";
import { ObraRequestDTO, ObraResponseDTO } from "../../interfaces/obra";
import { useForm } from "@refinedev/react-hook-form";
import { Edit } from "@refinedev/mui";
import { Backdrop, Box, Button, CircularProgress, Grid2, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { OBRA_STATUS_CONFIG } from "../../constants/status-config";
import { MapPicker } from "../../components/obras/MapPicker";
import { Controller, useWatch } from "react-hook-form";
import { ImagePreviewGrid } from "../../components/obras/ImagePreviewGrid";
import DeleteIcon from "@mui/icons-material/Delete";

export const ObraEdit: React.FC = () => {

    const {
        saveButtonProps, // Propiedades para el botón de guardar
        register, // Función para registrar campos del formulario
        control, // Controlador para manejar el estado del formulario
        formState: { errors }, // Estado de errores del formulario
        setValue, // Función para establecer valores en el formulario
        refineCore: { query: queryResult, formLoading }, // Resultado de la consulta y estado de carga
    } = useForm<ObraResponseDTO, any, ObraRequestDTO>({
        refineCoreProps: {
            resource: "obra",
            action: "edit",

        }
    });

    // Obtenemos los datos de la obra
    const obraData = queryResult?.data?.data;

    // Estado para almacenar las IDs de las imágenes que se deben mantener
    const [keepImageIds, setKeepImageIds] = useState<number[]>([]);

    // Sincronizar keepImageIds cuando cargan los datos por priemra vez.
    useEffect(() => {
        if (obraData) {
            const ids = obraData.images.map(img => img.id);
            setKeepImageIds(ids);
            setValue("keepImageIds", ids);

            // Forzamos la carga del estatus si el register no lo captura
        }
        if (obraData?.status) {
            setValue("status", obraData.status);
        }
    }, [obraData, setValue]);

    const lat = useWatch({ control, name: "latitude" });
    const lng = useWatch({ control, name: "longitude" });
    const files = useWatch({ control, name: "files" });

    // Función para manejar la eliminación de una imagen existente
    const handleRemoveExistingImage = (id: number) => {
        // Elimina el ID de la imagen eliminada
        const newIds = keepImageIds.filter(itemId => itemId !== id);
        // Actualiza el estado
        setKeepImageIds(newIds);
        // Actualiza el valor en el formulario
        setValue("keepImageIds", newIds);
    };

    // Calcular el total de imágenes (las que quedan + las nuevas)
    const totalImages = keepImageIds.length + (files?.length || 0);
    const isOverLimit = totalImages > 10;

    return (
        <>
            {/* Este overlay se muestra mientras se guarda el formulario */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: "column",
                }}
                open={formLoading}
            >
                <CircularProgress color="inherit" />
                <Stack
                    sx={{
                        mt: 2
                    }}
                    alignItems="center"
                >
                    <Typography variant="h6">
                        Guardando obra y evidencias...
                    </Typography>
                    <Typography variant="caption">
                        Esto puede tardar unos segundos dependiendo del tamaño de las imágenes.
                    </Typography>
                </Stack>
            </Backdrop>
            <Edit 
                saveButtonProps={{
                    ...saveButtonProps,
                    disabled: isOverLimit || formLoading, // Bloque por limite o por carga
                }} 
                title="Editar Obra"
            >
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}
                >
                    <Grid2
                        container
                        spacing={2}
                    >

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField
                                {...register("name", { required: "El nombre es obligatorio" })}
                                error={!!errors.name}
                                helperText={errors.name?.message as string}
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField
                                {...register("municipality", { required: "El municipio es obligatorio" })}
                                error={!!errors.municipality}
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <TextField
                                {...register("agency", { required: "La ajecutora es obligatorio" })}
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <TextField
                                {...register("investment", { required: true, valueAsNumber: true })}
                                type="number"
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <TextField
                                {...register("status", { required: "El estado es obligatorio", })}
                                select // Esto convierte el TextField en un select. Asegúrate de agregar las opciones correspondientes.
                                fullWidth
                                label="Estatus"
                                value={useWatch({ control, name: "status" }) || ""} // Usamos value vinculado al formulario.
                                onChange={(e) => setValue("status", e.target.value, { shouldValidate: true })} // Aseguramos que el cambio se registre inmediatamente
                                slotProps={{ inputLabel: { shrink: true } }}
                            >
                                {/*
                                                                Clean Code: Mapeamos el objeto de configuración
                                                                object.entries nos da el [key, value]
                                                                Ejemplo: ["FINALIZADA", {label: Finalizada, color: "success"}]
                                                            */}
                                {Object.entries(OBRA_STATUS_CONFIG).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    bgcolor: `${value.chipColor}.main`,
                                                    flexShrink: 0, // Evita que el círculo se aplaste si el texto es largo
                                                }}
                                            >
                                            </Box>
                                                <Typography variant="body2">{value.label}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid2>

                        <Grid2 size={{ xs: 6 }}>
                            <TextField
                                {...register("latitude", { required: true, valueAsNumber: true })}
                                type="number"
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 6 }}>
                            <TextField
                                {...register("longitude", { required: true, valueAsNumber: true })}
                                type="number"
                                fullWidth
                            />
                        </Grid2>

                        {/* Mapa reactivo */}
                        <Grid2
                            size={{
                                xs: 12,
                            }}
                        >
                            <Typography>
                                Ubicación geográfica de la obra
                            </Typography>
                            <MapPicker
                                lat={lat}
                                lng={lng}
                                onChange={(newLat, newLng) => {
                                    // Actualizamos los campos del fomrmulario automáticamente
                                    setValue("latitude", newLat, { shouldValidate: true })
                                    setValue("longitude", newLng, { shouldValidate: true })
                                }}
                            />
                        </Grid2>

                        <Grid2
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <TextField
                                {...register("progress", {
                                    required: "El avance es obligatorio",
                                    min: { value: 0, message: "El avance debe ser al menos 0%" },
                                    max: { value: 100, message: "El avance no puede ser mayor a 100%" },
                                    valueAsNumber: true,
                                })}
                                error={!!errors.progress}
                                helperText={errors.progress?.message as string}
                                type="number"
                                fullWidth
                                slotProps={{
                                    htmlInput: {
                                        min: 0,
                                        max: 100
                                    }
                                }}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12 }}>
                            <TextField
                                {...register("description")}
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Grid2>

                        {/* Galeria 1: Imagnes actuales en el servidor */}
                        <Grid2 size={{ xs: 12 }}>
                            <Typography variant="h6" gutterBottom>
                                Imágenes Actuales
                            </Typography>

                            <Stack
                                direction='row'
                                spacing={2}
                                sx={{
                                    mt: 2,
                                    flexWrap: 'wrap',
                                    gap: 2
                                }}
                            >
                                {obraData?.images.filter(img => keepImageIds.includes(img.id)).map((img) => (
                                    <Box
                                        key={img.id}
                                        sx={{
                                            position: 'relative',
                                            width: 100,
                                            height: 100,
                                        }}
                                    >
                                        <Box
                                            component='img'
                                            src={img.thumbUrl}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: 1,
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemoveExistingImage(img.id)}
                                            sx={{
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                bgcolor: 'white'
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>


                                    </Box>
                                ))}
                            </Stack>
                        </Grid2>

                        {/* Galeria 2: Nuevas Imagenes a subir */}
                        <Grid2
                            size={{
                                xs: 12
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Agregar nuevas imágenes
                            </Typography>
                            <Typography 
                                variant="h6"
                                color={
                                    isOverLimit ? 'error' : 'text.primary'
                                }
                            >
                                Imágenes de la Obra ({totalImages}/10)
                                {isOverLimit && " - ¡Has excedido el límite!" }
                            </Typography>
                            <Controller
                                control={control}
                                name="files"
                                rules={{
                                    validate: () => totalImages <= 10 || "El total de imágenes no puede ser mayor a 10"
                                }}
                                render={({ field, fieldState: { error} }) => (
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            component='label'
                                            fullWidth
                                            sx={{
                                                mt: 1,
                                                borderStyle: 'dashed'
                                            }}
                                            color={
                                                isOverLimit ? 'error' : 'primary'
                                            }
                                        >
                                            Seleccionar archivos
                                            <input type="file" hidden multiple accept="image/*"
                                                onChange={(e) => {
                                                    const newFiles = Array.from(e.target.files || []);
                                                    field.onChange([...(field.value || []), ...newFiles.map(f => ({ originFileObj: f }))]);
                                                }}
                                            />
                                        </Button>
                                        <ImagePreviewGrid
                                            files={field.value || []}
                                            onDelete={(index) => field.onChange((field.value || []).filter((_: any, i: number) => i !== index))}
                                        />
                                    </Box>
                                )}
                            />
                        </Grid2>

                    </Grid2>
                </Box>
            </Edit>
        </>
    );

};