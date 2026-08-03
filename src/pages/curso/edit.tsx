import React, { useState, useEffect } from "react";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, Grid2, Typography, Button, Paper, Stack, Backdrop, CircularProgress, IconButton } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { CursoRequestDTO, CursoResponseDTO } from "../../interfaces/curso/curso";
import { ImagePreviewGrid } from "../../components/obras/ImagePreviewGrid";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from "@mui/icons-material/Delete";
import { MapPicker } from "../../components/obras/MapPicker";
import geoData from "../../assets/data/yucatan_municipios_2023.json";

export const CursoEdit = () => {
    // 1. Añadimos estado para validar la portada
    const [coverError, setCoverError] = useState(false);

    // Estados para las fotos nuevas
    const [originalCoverId, setOriginalCoverId] = useState<number | null>(null);
    const [newCoverFile, setNewCoverFile] = useState<any | null>(null);
    const [newGalleryFiles, setNewGalleryFiles] = useState<any[]>([]);

    // Estado para las fotos que ya existen en el servidor
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [existingCover, setExistingCover] = useState<any | null>(null);

    // Calculamos: (Imágenes de galería que se quedan) + (Nuevas imágenes de galería)
    const currentGalleryCount = existingImages.filter(img => img.id !== originalCoverId).length;
    const totalGalleryImages = currentGalleryCount + newGalleryFiles.length;
    const isGalleryOverLimit = totalGalleryImages > 10;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

    // Estado para el buscador del mapa 
    const [municipioABuscar, setMunicipioABuscar] = useState<string | null>(null);

    // Función auxiliar para comparar textos ignorando acentos y mayúsculas/minúsculas
    const normalizeText = (text: string) => {
        if (!text) return "";
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    };

    const {
        saveButtonProps,
        register,
        control,
        formState: { errors },
        setValue,
        handleSubmit,
        refineCore: { onFinish, query, formLoading },
    } = useForm<CursoResponseDTO, any, CursoRequestDTO>({
        refineCoreProps: {
            resource: "curso",
            action: "edit",
            redirect: "list",
        },
    });

    // Mensaje dinámico según la acción
    const loadingMessage = query?.isLoading
        ? "Cargando información del curso..."
        : "Actualizando curso y galería...";

    // Cargamos los datos iniciales del curso
    const cursoData = query?.data?.data;

    const { autocompleteProps } = useAutocomplete({
        resource: "municipio",
        meta: { endpoint: "list" },
    });

    useEffect(() => {
        if (cursoData) {
            setExistingImages(cursoData.images || []);
            setExistingCover(cursoData.coverImage || null);
            setOriginalCoverId(cursoData.coverImage?.id || null);
        }
    }, [cursoData]);

    // 💡 NUEVO: Sincronizar el municipio de la base de datos con el buscador del mapa
    useEffect(() => {
        if (cursoData?.municipalityId && autocompleteProps.options.length > 0) {
            // Buscamos el objeto del municipio usando el ID que vino de la BD
            const municipioGuardado = autocompleteProps.options.find(
                (opt: any) => opt.id === cursoData.municipalityId
            );

            // Si lo encuentra y el buscador está vacío, lo asignamos para que el mapa haga focus
            if (municipioGuardado && !municipioABuscar) {
                setMunicipioABuscar(municipioGuardado.name);
            }
        }
    }, [cursoData, autocompleteProps.options]); // Se ejecuta cuando cargan los datos del curso o las opciones

    const municipiosOptions = geoData.features.map(f => f.properties?.NOMGEO).sort();

    const lat = useWatch({ control, name: "latitude" });
    const lng = useWatch({ control, name: "longitude" });

    const handleCustomSubmit = (values: any) => {
        // VALIDACIÓN: ¿Hay alguna portada disponible? (Nueva o Existente)
        const hasCover = newCoverFile || existingCover;

        if (!hasCover) {
            setCoverError(true);
            // Hacemos scroll hacia arriba para que el usuario vea el error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setCoverError(false);
        // 1. Array de IDs que se quedan
        let keepImageIds: number[] = [];

        if (newCoverFile) {
            // ESCENARIO A: El usuario seleccionó una portada nueva.
            // NO incluimos el ID de la portada anterior en keepImageIds.
            // Solo incluimos los IDs de la galería que el usuario no borró.
            keepImageIds = existingImages
                .filter(img => img.id !== cursoData?.coverImage?.id) // Excluimos la portada vieja
                .map(img => img.id);
        } else {
            // ESCENARIO B: El usuario NO seleccionó portada nueva.
            // Mantenemos la portada actual (si existe y no la borró) + galería.
            keepImageIds = existingImages.map(img => img.id);
        }

        // 2. Preparar archivos (Índice 0 = Portada)
        const finalFiles: any[] = [];
        if (newCoverFile) finalFiles.push(newCoverFile);
        if (newGalleryFiles.length > 0) finalFiles.push(...newGalleryFiles);

        // 3. Enviar
        onFinish({
            ...values,
            keepImageIds,
            files: finalFiles,
        });
    };


    return (
        <>
            {/* Overlay de Carga para Edición */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: "column",
                    backdropFilter: "blur(4px)"
                }}
                open={query?.isLoading || formLoading}
            >
                <CircularProgress color="inherit" />
                <Stack sx={{ mt: 2 }} alignItems="center">
                    <Typography variant="h6">{loadingMessage}</Typography>
                    <Typography variant="caption">Esto puede tardar unos segundos.</Typography>
                </Stack>
            </Backdrop>
            <Edit saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(handleCustomSubmit) }} isLoading={query?.isLoading} title="Editar Curso">
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
                    <Grid2 container spacing={3}>
                        {/* Campos de texto (Título, Descripción, etc. igual que en Create) */}
                        <Grid2 size={{ xs: 12, md: 8 }}>
                            <TextField {...register("title", { required: "Obligatorio" })} label="Título" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                            <TextField {...register("description", { required: "Obligatorio" })} label="Descripción" multiline rows={4} fullWidth sx={{ mt: 2 }} slotProps={{ inputLabel: { shrink: true } }} />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <Controller
                                control={control}
                                name="municipalityId"
                                rules={{ required: "El municipio es obligatorio" }}
                                render={({ field }) => {
                                    // Buscamos el objeto completo para que el Select muestre el texto
                                    const selectedOption = autocompleteProps.options?.find(
                                        (item: any) => item.id === field.value
                                    ) || null;

                                    return (
                                        <Autocomplete
                                            {...autocompleteProps}
                                            value={selectedOption}
                                            open={false} // Bloquea el menú desplegable
                                            forcePopupIcon={false} // Oculta la flecha
                                            readOnly // Deshabilita la interacción
                                            onChange={(_, newValue: any) => {
                                                field.onChange(newValue?.id || null);
                                            }}
                                            getOptionLabel={(item) => (typeof item === "object" ? item.name : "")}
                                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Municipio (Detectado por Mapa)"
                                                    variant="filled"
                                                    slotProps={{
                                                        input: {
                                                            ...params.InputProps,
                                                            readOnly: true,
                                                        },
                                                        inputLabel: { shrink: true }
                                                    }}
                                                    error={!!errors.municipalityId}
                                                    helperText={errors.municipalityId ? (errors.municipalityId.message as string) : "Selecciona la ubicación en el mapa."}
                                                />
                                            )}
                                        />
                                    );
                                }}
                            />
                            <TextField {...register("courseDate")} type="date" label="Fecha" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
                        </Grid2>

                        <Grid2 size={{ xs: 6 }}>
                            <Controller
                                control={control}
                                name="latitude"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Latitud"
                                        fullWidth
                                        variant="filled"
                                        slotProps={{
                                            input: { readOnly: true },
                                            inputLabel: { shrink: true }
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
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Longitud"
                                        fullWidth
                                        variant="filled"
                                        slotProps={{
                                            input: { readOnly: true },
                                            inputLabel: { shrink: true }
                                        }}
                                        helperText={errors.longitude ? (errors.longitude.message as string) : "Selecciona la ubicación en el mapa para detectar la longitud automáticamente."}
                                    />
                                )}
                            />
                        </Grid2>

                        {/* Mapa reactivo */}
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
                                    {municipioABuscar && (
                                        <Button
                                            size="small"
                                            onClick={() => setMunicipioABuscar(null)}
                                            sx={{ textTransform: 'none', color: '#901b45' }}
                                        >
                                            Limpiar búsqueda
                                        </Button>
                                    )}
                                </Box>

                                {/* Buscador de apoyo para el mapa */}
                                <Autocomplete
                                    options={municipiosOptions}
                                    value={municipioABuscar}
                                    onChange={(_, newValue) => setMunicipioABuscar(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Buscar para acercar..." size="small" />
                                    )}
                                />
                                <MapPicker
                                    lat={lat}
                                    lng={lng}
                                    targetMunicipio={municipioABuscar}
                                    onChange={(newLat, newLng) => {
                                        // Actualizamos las coordenadas
                                        setValue("latitude", newLat, { shouldValidate: true });
                                        setValue("longitude", newLng, { shouldValidate: true });
                                    }}
                                    onMunicipioDetectado={(nameFromMap) => {
                                        // 1. Obtenemos las opciones del backend (las que alimentan el select bloqueado)
                                        const opcionesBackend = autocompleteProps.options || [];

                                        // 2. Buscamos el municipio ignorando acentos y mayúsculas
                                        const municipioEncontrado = opcionesBackend.find((opt: any) =>
                                            normalizeText(opt.name) === normalizeText(nameFromMap)
                                        );

                                        if (municipioEncontrado) {
                                            // 3. AQUÍ ESTÁ LA MAGIA: Guardamos el ID en 'municipalityId' (Adiós error de TS)
                                            setValue("municipalityId", municipioEncontrado.id, { shouldValidate: true });
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
                                    borderColor: coverError ? 'error.main' : 'divider',
                                    bgcolor: coverError ? '#fff5f5' : 'inherit',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color={coverError ? "error" : "textPrimary"}
                                >
                                    PORTADA ACTUAL / NUEVA {coverError && " - (LA PORTADA ES OBLIGATORIA)"}
                                </Typography>

                                <Box sx={{ mt: 2, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                    {newCoverFile ? (
                                        <ImagePreviewGrid files={[newCoverFile]} onDelete={() => setNewCoverFile(null)} />
                                    ) : existingCover ? (
                                        /* DISEÑO HOMOLOGADO CON OBRA: Imagen con Icono flotante */
                                        <Box sx={{ position: 'relative', width: 150, height: 100 }}>
                                            <img
                                                src={existingCover.url}
                                                alt="Portada actual"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                            />
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setExistingCover(null);
                                                    // También lo quitamos de la lista de IDs a mantener
                                                    setExistingImages(prev => prev.filter(img => img.id !== originalCoverId));
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -10,
                                                    right: -10,
                                                    bgcolor: 'white',
                                                    boxShadow: 2,
                                                    '&:hover': { bgcolor: '#ffebee' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ) : (
                                        <Box sx={{
                                            width: 150,
                                            height: 100,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'divider',
                                            borderRadius: 2,
                                            border: coverError ? '1px solid red' : 'none'
                                        }}>
                                            <Typography variant="caption" color="error">Sin portada seleccionada</Typography>
                                        </Box>
                                    )}

                                    <Stack spacing={1}>
                                        <Button
                                            component="label"
                                            variant={coverError ? "contained" : "outlined"}
                                            color={coverError ? "error" : "primary"}
                                            startIcon={<AddPhotoAlternateIcon />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {existingCover || newCoverFile ? "Cambiar Portada" : "Subir Portada"}
                                            <input type="file" hidden accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setNewCoverFile({ originFileObj: file });
                                                    setExistingImages(prev => prev.filter(img => img.id !== originalCoverId));
                                                    setExistingCover(null);
                                                    setCoverError(false); // Quitamos el error al seleccionar
                                                }
                                            }} />
                                        </Button>
                                        <Typography variant="caption" color="textSecondary">
                                            Formatos: JPG, PNG. Máx 10MB.
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid2>

                        {/* SECCIÓN GALERÍA */}
                        <Grid2 size={12}>
                            <Typography
                                variant="subtitle2"
                                color={isGalleryOverLimit ? "error" : "textPrimary"}
                            >
                                GALERÍA ({totalGalleryImages}/10)
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} disabled={totalGalleryImages >= 10}>
                                    Añadir Fotos
                                    <input type="file" hidden multiple accept="image/*" onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        setNewGalleryFiles([...newGalleryFiles, ...files.map(f => ({ originFileObj: f }))]);
                                    }} />
                                </Button>

                                {/* Mezclamos visualmente las existentes y las nuevas */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {/* 1. IMÁGENES QUE YA ESTÁN EN EL SERVIDOR */}
                                    {existingImages.filter(img => img.id !== originalCoverId).map(img => (
                                        <Box key={img.id} sx={{ position: 'relative', width: 100, height: 100 }}>
                                            <Box
                                                component="img"
                                                src={img.thumbUrl}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
                                            />
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => setExistingImages(existingImages.filter(i => i.id !== img.id))}
                                                sx={{ position: 'absolute', top: -5, right: -5, bgcolor: 'white', boxShadow: 1 }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}

                                    {/* 2. AQUÍ ESTABA EL FALTANTE: LAS NUEVAS IMÁGENES SELECCIONADAS */}
                                    <ImagePreviewGrid
                                        files={newGalleryFiles}
                                        onDelete={(idx) => setNewGalleryFiles(newGalleryFiles.filter((_, i) => i !== idx))}
                                    />
                                </Box>
                            </Stack>
                        </Grid2>
                    </Grid2>
                </Box>
            </Edit>
        </>
    );
};