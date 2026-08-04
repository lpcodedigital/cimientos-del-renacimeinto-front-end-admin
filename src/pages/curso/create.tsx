import { useState } from "react";
import { Create, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, Grid2, Typography, Button, Paper, Stack, Backdrop, CircularProgress } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { CursoRequestDTO } from "../../interfaces/curso/curso";
import { ImagePreviewGrid } from "../../components/obras/ImagePreviewGrid";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import geoData from "../../assets/data/yucatan_municipios_2023.json";
import { MapPicker } from "../../components/obras/MapPicker";

export const CursoCreate = () => {
    const [coverError, setCoverError] = useState(false);
    const [coverFile, setCoverFile] = useState<any | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<any[]>([]);

    const totalNewImages = (coverFile ? 1 : 0) + galleryFiles.length;
    const isOverLimit = totalNewImages > 11; // 1 portada + 10 galería

    const {
        saveButtonProps,
        register,
        setValue,
        control,
        formState: { errors },
        handleSubmit, // Este es el de react-hook-form
        refineCore: { onFinish, formLoading } // Este es el que envía al Data Provider
    } = useForm<CursoRequestDTO>({
        refineCoreProps: {
            resource: "curso",
            action: "create",
            redirect: "list",
        },
    });

    // Función auxiliar para comparar textos ignorando acentos y mayúsculas/minúsculas
    const normalizeText = (text: string) => {
        if (!text) return "";
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quita acentos
            .toLowerCase()
            .trim();
    };

    // Función para procesar y enviar
    const handleCustomSubmit = (values: any) => {
        // VALIDACIÓN CRÍTICA: Si no hay portada, detenemos el envío
        if (!coverFile) {
            setCoverError(true);
            return;
        }
        setCoverError(false);

        // REORDENAMIENTO: Portada siempre en índice 0
        const finalFiles: any[] = [];

        if (coverFile) finalFiles.push(coverFile);
        if (galleryFiles.length > 0) finalFiles.push(...galleryFiles);

        // Ejecutamos el envío de Refine con el array ya ordenado
        onFinish({
            ...values,
            files: finalFiles,
        });
    };

    const { autocompleteProps } = useAutocomplete({
        resource: "municipio",
        meta: { endpoint: "list" },
    });

    const municipiosOptions = geoData.features.map(f => f.properties?.NOMGEO).sort();

    // Escuchamos los valores de lat/lng para pasarselos al mapa
    const lng = useWatch({ control, name: "longitude" });
    const lat = useWatch({ control, name: "latitude" });

    // Estado para el buscador de municipios en el mapa
    const [municipioBusqueda, setMunicipioBusqueda] = useState<string | null>(null);

    return (
        <>
            {/* Overlay de Carga para Creación */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: "column",
                    backdropFilter: "blur(4px)" // Un ligero desenfoque se ve muy profesional
                }}
                open={formLoading}
            >
                <CircularProgress color="inherit" />
                <Stack sx={{ mt: 2 }} alignItems="center">
                    <Typography variant="h6">Subiendo curso y multimedia...</Typography>
                    <Typography variant="caption">
                        Estamos procesando las imágenes en la nube. Por favor, espera.
                    </Typography>
                </Stack>
            </Backdrop>
            <Create
                saveButtonProps={{
                    ...saveButtonProps,
                    onClick: handleSubmit(handleCustomSubmit) as any,
                }}
                isLoading={formLoading}
                title="Crear Nuevo Curso">
                <Box
                    component="form"
                    // IMPORTANTE: Usamos el handleSubmit de hook-form con nuestra función
                    onSubmit={handleSubmit(handleCustomSubmit)}
                    sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
                >
                    <Grid2 container spacing={3}>
                        {/* Campos de Texto */}
                        <Grid2 size={{ xs: 12, md: 8 }}>
                            <Stack spacing={3}>
                                <TextField
                                    {...register("title", { required: "El título es obligatorio" })}
                                    error={!!errors.title}
                                    helperText={errors.title?.message as string}
                                    label="Título del Curso"
                                    fullWidth
                                />
                                <TextField
                                    {...register("description", { required: "La descripción es obligatoria" })}
                                    error={!!errors.description}
                                    helperText={errors.description?.message as string}
                                    label="Descripción"
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </Stack>
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <Stack spacing={3}>
                                <Controller
                                    control={control}
                                    name="municipalityId"
                                    rules={{ required: "El municipio es obligatorio" }}
                                    render={({ field }) => {

                                        // 💡 CLAVE: Buscamos el objeto completo basado en el ID que tiene react-hook-form
                                        const selectedOption = autocompleteProps.options.find(
                                            (opt: any) => opt.id === field.value
                                        ) || null;

                                        return (
                                            <Autocomplete
                                                {...autocompleteProps} // Pasa las opciones, loading, etc.
                                                value={selectedOption} // Le pasamos el objeto completo
                                                open={false} // Evitamos que se abra el dropdown, ya que solo queremos selección manual
                                                forcePopupIcon={false} // Oculta el ícono de dropdown
                                                readOnly // Evita que el usuario escriba, solo puede seleccionar del mapa
                                                onInputChange={(_, newInputValue) => {
                                                    // Si el usuario borra el input, limpiamos el ID en el formulario
                                                    if (newInputValue === "") {
                                                        field.onChange(null);
                                                    }
                                                }}
                                                onChange={(_, newValue: any) => {
                                                    // Cuando el usuario elige manualmente, guardamos el ID
                                                    field.onChange(newValue?.id || null);
                                                }}
                                                getOptionLabel={(item) => item?.name || ""}
                                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Municipio"
                                                        variant="filled"
                                                        error={!!errors.municipalityId}
                                                        helperText={errors.municipalityId?.message as string}
                                                    />
                                                )}
                                            />
                                        );
                                    }}
                                />
                                <TextField
                                    {...register("courseDate", { required: "La fecha es obligatoria" })}
                                    type="date"
                                    label="Fecha"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    error={!!errors.courseDate}
                                    helperText={errors.courseDate?.message as string}
                                />
                            </Stack>
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
                                        variant="filled"
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
                                        variant="filled"
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
                                Ubicación geográfica del curso
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
                                    onMunicipioDetectado={(nameFromMap) => {
                                        // 1. Obtenemos las opciones que cargó el backend
                                        const opcionesBackend = autocompleteProps.options || [];

                                        // 2. Comparamos el nombre del mapa con las opciones del backend
                                        const municipioEncontrado = opcionesBackend.find((opt: any) =>
                                            normalizeText(opt.name) === normalizeText(nameFromMap)
                                        );

                                        if (municipioEncontrado) {
                                            // 3. Si lo encuentra, guardamos el ID en el formulario
                                            setValue("municipalityId", municipioEncontrado.id, { shouldValidate: true });

                                            // Opcional: si también tienes un campo "municipality" string, lo puedes guardar
                                            // setValue("municipality", municipioEncontrado.name);
                                        } else {
                                            console.warn(`El municipio "${nameFromMap}" detectado en el mapa no coincide con ninguno en la base de datos.`);
                                            // Aquí podrías usar un toast/snackbar de MUI para avisarle al usuario
                                        }
                                    }}
                                />
                            </Stack>

                        </Grid2>

                        {/* SECCIÓN PORTADA */}
                        <Grid2 size={12}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    borderStyle: 'dashed',
                                    borderColor: coverError ? 'error.main' : 'inherit', // Poner rojo si hay error
                                    bgcolor: coverError ? '#fff5f5' : 'inherit'
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    color={coverError ? "error" : "inherit"}
                                    gutterBottom
                                >
                                    PORTADA DEL CURSO * {coverError && "(Es obligatoria)"}
                                </Typography>
                                <Button component="label" variant="contained" startIcon={<AddPhotoAlternateIcon />} color={coverError ? "error" : "primary"}>
                                    Seleccionar Portada
                                    <input type="file" hidden accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setCoverFile({ originFileObj: file });
                                            setCoverError(false); // Limpiar error al seleccionar
                                        }}
                                    />
                                </Button>
                                {coverFile && (
                                    <Box sx={{
                                        mt: 2,
                                        width: 200,
                                        height: 150, // O el tamaño que desees
                                        overflow: 'hidden',
                                        borderRadius: 1,
                                        border: '1px solid #ccc'
                                    }}>
                                        <img
                                            src={URL.createObjectURL(coverFile.originFileObj)}
                                            alt="Portada"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover' // Esto evita que se "apachurre"
                                            }}
                                            // Limpiamos la URL de memoria al desmontar
                                            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(coverFile.originFileObj))}
                                        />
                                    </Box>
                                )}
                            </Paper>
                        </Grid2>

                        {/* SECCIÓN GALERÍA */}
                        <Grid2 size={12}>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                color={isOverLimit ? "error" : "textPrimary"}
                                gutterBottom
                            >
                                📸 Galería de Imágenes ({galleryFiles.length}/10)
                                {isOverLimit && " - ¡Límite excedido!"}
                            </Typography>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                disabled={galleryFiles.length >= 10} // Opcional: bloquear el botón al llegar a 10
                                color={isOverLimit ? "error" : "primary"}
                                sx={{ mb: 2 }}
                            >
                                Añadir a la Galería
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        // Evitamos que suba más de lo permitido
                                        if (galleryFiles.length + files.length > 10) {
                                            alert("Solo puedes subir un máximo de 10 imágenes para la galería");
                                            return;
                                        }
                                        setGalleryFiles([...galleryFiles, ...files.map(f => ({ originFileObj: f }))]);
                                    }}
                                />
                            </Button>
                            <ImagePreviewGrid
                                files={galleryFiles}
                                onDelete={(idx) => setGalleryFiles(galleryFiles.filter((_, i) => i !== idx))}
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </Create>
        </>
    );
};