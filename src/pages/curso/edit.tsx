import React, { useState, useEffect } from "react";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, Grid2, Typography, Button, Paper, Stack, Backdrop, CircularProgress, IconButton } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { CursoRequestDTO, CursoResponseDTO } from "../../interfaces/curso/curso";
import { ImagePreviewGrid } from "../../components/obras/ImagePreviewGrid";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from "@mui/icons-material/Delete";

export const CursoEdit = () => {
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

    const {
        saveButtonProps,
        register,
        control,
        formState: { errors },
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

    useEffect(() => {
        if (cursoData) {
            setExistingImages(cursoData.images || []);
            setExistingCover(cursoData.coverImage || null);
            setOriginalCoverId(cursoData.coverImage?.id || null);
        }
    }, [cursoData]);

    const handleCustomSubmit = (values: any) => {
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

    const { autocompleteProps } = useAutocomplete({
        resource: "municipio",
        meta: { endpoint: "list" },
    });

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
                                render={({ field }) => (
                                    <Autocomplete
                                        {...autocompleteProps}
                                        {...field}
                                        // Comparamos la opción con el ID actual del formulario
                                        onChange={(_, value) => field.onChange(value?.id)}
                                        // Buscamos el objeto correspondiente al ID para mostrar el nombre
                                        value={
                                            autocompleteProps.options?.find(
                                                (item) => item.id === field.value
                                            ) || null
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            value === undefined ||
                                            value === null ||
                                            option.id === (value.id ?? value)
                                        }
                                        getOptionLabel={(item) => (typeof item === "object" ? item.name : "")}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Municipio"
                                                error={!!errors.municipalityId}
                                                helperText={errors.municipalityId?.message as string}
                                            />
                                        )}
                                    />
                                )}
                            />
                            <TextField {...register("courseDate")} type="date" label="Fecha" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
                        </Grid2>

                        {/* SECCIÓN PORTADA */}
                        <Grid2 size={12}>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f0f4f8', borderStyle: 'dashed' }}>
                                <Typography variant="subtitle2" gutterBottom>PORTADA ACTUAL / NUEVA</Typography>

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
                                        <Box sx={{ width: 150, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'divider', borderRadius: 2 }}>
                                            <Typography variant="caption" color="textSecondary">Sin portada</Typography>
                                        </Box>
                                    )}

                                    <Stack spacing={1}>
                                        <Button
                                            component="label"
                                            variant="outlined"
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
                                                }
                                            }} />
                                        </Button>
                                        <Typography variant="caption" color="textSecondary">
                                            Formatos: JPG, PNG. Máx 5MB.
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