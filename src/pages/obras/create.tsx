import { useForm } from "@refinedev/react-hook-form";
import { ObraRequestDTO } from "../../interfaces/obra";
import { Create } from "@refinedev/mui";
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Grid2, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import { OBRA_STATUS_CONFIG } from "../../constants/status-config";
import { ImagePreviewGrid } from "../../components/obras/ImagePreviewGrid";
import { MapPicker } from "../../components/obras/MapPicker";
import geoData from "../../assets/data/yucatan_municipios_2023.json";
import { useState } from "react";

export const ObraCreate = () => {

    const {
        saveButtonProps,
        register,
        setValue,
        control,
        formState: { errors },
        refineCore: { formLoading }
    } = useForm<ObraRequestDTO>({
        refineCoreProps: {
            resource: "obra",
            action: "create",
            // Si tu API tiene un endpoint específico para crear, puedes especificarlo aquí. De lo contrario, se usará el endpoint por defecto.
            //meta: {
            //    endpoint: "create",
            //},
        }
    });

    const municipiosOptions = geoData.features.map(f => f.properties?.NOMGEO).sort();

    // Escuchamos los valores de lat/lng para pasarselos al mapa
    const lat = useWatch({ control, name: "latitude" });
    const lng = useWatch({ control, name: "longitude" });

    // Estado para el buscador de municipios en el mapa
    const [municipioBusqueda, setMunicipioBusqueda] = useState<string | null>(null);

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

            <Create
                saveButtonProps={{
                    ...saveButtonProps,
                    disabled: formLoading || Object.keys(errors).length > 0, // Bloqueamos el boton si esta cargando o si hay errores
                }}
                isLoading={formLoading} // refine pondra un spinner en el boton si esta cargando
                title="Crear Nueva Obra"
            >
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Grid2 container spacing={2}>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <TextField
                                {...register("name", { required: "El nombre es obligatorio" })}
                                error={!!errors.name}
                                helperText={errors.name?.message as string}
                                label="Nombre de la Obra"
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                            {/* 💡 Cambiamos el TextField por un Autocomplete */}
                            <Controller
                                control={control}
                                name="municipality"
                                rules={{ required: "El municipio es obligatorio" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Municipio"
                                        variant="filled" // Un estilo diferente ayuda a indicar que es especial
                                        slotProps={{
                                            input: {
                                                readOnly: true, // Evita edición manual
                                            },
                                            inputLabel: {
                                                shrink: true, // Mantiene el label arriba siempre
                                            }
                                        }}
                                        error={!!errors.municipality}
                                        helperText={errors.municipality ? (errors.municipality.message as string) : "Selecciona la ubicación en el mapa para detectar el municipio automáticamente."}
                                        fullWidth
                                    />
                                )}
                            />

                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <TextField
                                {...register("agency", { required: "La ajecutora es obligatorio" })}
                                label="Agencia Ejecutora"
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <TextField
                                {...register("investment", { required: true, valueAsNumber: true })}
                                label="Inversión (MXN)"
                                type="number"
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <TextField
                                {...register("status", { required: "El estado es obligatorio", })}
                                select // Esto convierte el TextField en un select. Asegúrate de agregar las opciones correspondientes.
                                label="Estatus"
                                fullWidth
                                error={!!errors.status}
                                helperText={errors.status?.message as string}
                                defaultValue="" // Importante para que no empiece como undefined
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
                                                }}
                                            >
                                            </Box>
                                            {value.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid2>

                        <Grid2 size={{ xs: 6 }}>
                            <Controller
                                control={control}
                                name="latitude"
                                rules={{ required: "La latitud es obligatoria" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Latitud"
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                readOnly: true, // No editable
                                            },
                                            inputLabel: {
                                                shrink: true, // Mantiene el label arriba siempre
                                            }
                                        }}
                                        helperText={errors.latitude ? (errors.latitude.message as string) : "Selecciona la ubicación en el mapa para detectar la latitud automáticamente."}
                                    />
                                )}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 6 }}>
                            <Controller
                                control={control}
                                name="longitude"
                                rules={{ required: "La longitud es obligatoria" }}
                                render={({ field }) => (
                                    
                                    <TextField
                                        {...field}
                                        label="Longitud"
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                readOnly: true, // No editable
                                            },
                                            inputLabel: {
                                                shrink: true, // Mantiene el label arriba siempre
                                            }
                                        }}
                                        helperText={errors.longitude ? (errors.longitude.message as string) : "Selecciona la ubicación en el mapa para detectar la longitud automáticamente."}
                                    />
                                )}
                            />
                        </Grid2>

                        <Grid2
                            size={{
                                xs: 12,
                            }}
                        >
                            <Typography>
                                Ubicación geográfica de la obra
                            </Typography>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2">📍 Ubicador de Municipio</Typography>
                                    {municipioBusqueda && (
                                        <Button
                                            size="small"
                                            onClick={() => setMunicipioBusqueda(null)}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Limpiar filtro
                                        </Button>
                                    )}
                                </Box>

                                <Autocomplete
                                    options={municipiosOptions}
                                    value={municipioBusqueda}
                                    onChange={(_, newValue) => setMunicipioBusqueda(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Escribe para buscar..." size="small" />
                                    )}
                                />
                                <MapPicker
                                    lat={lat}
                                    lng={lng}
                                    targetMunicipio={municipioBusqueda}
                                    onChange={(newLat, newLng) => {
                                        // Actualizamos los campos del fomrmulario automáticamente
                                        setValue("latitude", newLat, { shouldValidate: true })
                                        setValue("longitude", newLng, { shouldValidate: true })
                                    }}
                                    onMunicipioDetectado={(name) => {
                                        setValue("municipality", name, { shouldValidate: true });
                                    }}
                                />
                            </Stack>

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
                                label="Avance de la obra (%)"
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
                                label="Descripción"
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12 }}>
                            <Typography variant="h6" gutterBottom>
                                Evidencia fotográfica (Máx. 10)
                            </Typography>
                            <Controller
                                control={control}
                                name="files"
                                rules={{
                                    validate: (value) => {

                                        if (value && value.length > 10) {
                                            return "No puedes seleccionar más de 10 imagenes"
                                        }
                                        return true
                                    }
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <Box>

                                        <Button
                                            variant="outlined"
                                            component="label"
                                            fullWidth
                                            color={error ? "error" : "primary"}
                                            sx={{ py: 2, borderStyle: "dashed" }}
                                        >
                                            Seleccionar Imágenes
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const newFiles = Array.from(e.target.files || []);
                                                    const currentFiles = field.value || [];
                                                    // Combinamos los archivos actuales con los nuevos y Mapeamos la estructura que espera el provider
                                                    field.onChange([...currentFiles, ...newFiles.map(file => ({ originFileObj: file }))]);
                                                }}
                                            />

                                        </Button>

                                        {/* Previsualización de las imagenes */}


                                        {/* Mensaje de error */}
                                        {error && (
                                            <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                                                {error.message}
                                            </Typography>
                                        )}

                                        {/* Componente de previsualización */}
                                        <ImagePreviewGrid
                                            files={field.value || []}
                                            onDelete={(indexToRemove: number) => {
                                                const updateFiles = field.value.filter((_: any, index: number) => index !== indexToRemove);
                                                field.onChange(updateFiles);
                                            }}
                                        />
                                    </Box>
                                )}
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </Create>
        </>
    );

};