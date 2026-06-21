import React, { useEffect, useState } from "react";
import { IResourceComponentsProps, useDelete, CanAccess, HttpError } from "@refinedev/core";
import { useDataGrid, List, DateField, EditButton, ShowButton, } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    Avatar, Typography, Stack, Box, Backdrop, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, InputAdornment
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CursoResponseDTO } from "../../interfaces/curso/curso";
import ClearIcon from "@mui/icons-material/Clear";

export const CursoList: React.FC<IResourceComponentsProps> = () => {
    // Estados para el control del borrado manual
    const [openConfirm, setOpenConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchText, setSearchText] = useState("");

    const { mutate } = useDelete();

    const { dataGridProps, setFilters } = useDataGrid<CursoResponseDTO, HttpError>({
        syncWithLocation: true,
        resource: "curso",
        meta: {
            endpoint: "list",
        },
    });

    // Recuperamos de forma segura el total de elementos directo desde el hook de Refine
    const totalResultados = dataGridProps.rowCount ?? 0;

    const columns = React.useMemo<GridColDef<CursoResponseDTO>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                width: 50,
                disableColumnMenu: true,
            },
            {
                field: "coverImage",
                headerName: "Portada",
                renderCell: ({ value }) => (
                    <Avatar
                        variant="rounded"
                        src={value?.thumbUrl || "/default-course.png"}
                        alt="Portada"
                        sx={{ width: 45, height: 45, boxShadow: 1 }}
                    />
                ),
                width: 80,
                sortable: false,
                disableColumnMenu: true,
            },
            {
                field: "title",
                headerName: "Título",
                flex: 1,
                minWidth: 200,
                renderCell: ({ value }) => (
                    <Typography variant="body2" fontWeight="bold">
                        {value}
                    </Typography>
                ),
                disableColumnMenu: true,
            },
            {
                field: "municipalityName",
                headerName: "Municipio",
                width: 150,
                disableColumnMenu: true,
            },
            {
                field: "courseDate",
                headerName: "Fecha",
                width: 120,
                renderCell: ({ value }) => <DateField value={value} format="DD/MM/YYYY" />,
                disableColumnMenu: true,
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                disableColumnMenu: true,
                renderCell: ({ row }) => (
                    <Stack direction="row" spacing={1}>
                        <EditButton hideText size="small" recordItemId={row.id} />
                        <ShowButton hideText size="small" recordItemId={row.id} />

                        <CanAccess resource="curso" action="delete" fallback={null}>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedId(row.id);
                                    setOpenConfirm(true);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </CanAccess>
                    </Stack>
                ),
                align: "center",
                headerAlign: "center",
                width: 150,
            },
        ],
        []
    );

    //EFECTO CON DEBOUNCE: Escucha los cambios de 'searchText'
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Aplicamos los filtros de Refine de forma automática
            setFilters([
                {
                    field: "search",
                    operator: "contains",
                    value: searchText.trim() || undefined, // Si está vacío (o borrado), manda undefined y Refine recarga TODO
                },
            ]);
        }, 400); // 400 milisegundos de espera tras la última pulsación de tecla

        // Limpieza del timer si el usuario sigue escribiendo antes de los 400ms
        return () => clearTimeout(delayDebounceFn);
    }, [searchText, setFilters]);

    //Función para el botón 'X' (Limpia instantáneamente)
    const handleClear = () => {
        setSearchText(""); // Al ponerse en "", el useEffect de arriba se dispara solo y recarga todo
    };

    return (
        <>
            {/* Backdrop de seguridad para el borrado remoto (Cloudflare + DB) */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: "column",
                    backdropFilter: "blur(4px)",
                }}
                open={isDeleting}
            >
                <CircularProgress color="inherit" />
                <Stack sx={{ mt: 2 }} alignItems="center" spacing={1}>
                    <Typography variant="h6">
                        Eliminando curso y multimedia...
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Limpiando imágenes en el servidor de almacenamiento.
                    </Typography>
                </Stack>
            </Backdrop>

            <List title="Cursos">

                {/* Contenedor flexible para alinear buscador y contador */}
            <Stack 
                direction={{ xs: "column", sm: "row" }} 
                justifyContent="space-between" 
                alignItems={{ xs: "flex-start", sm: "center" }} 
                spacing={2} 
                sx={{ mb: 3 }}
            >
                {/* 1. Buscador */}
                <Box sx={{ width: "100%", maxWidth: "400px" }}>
                    <TextField
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Buscar titulo, municipio o descripción..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            endAdornment: searchText && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={handleClear} edge="end">
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* 2. Contador de Resultados dinámico */}
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    {searchText.trim() 
                        ? `Resultados encontrados: ${totalResultados}` 
                        : `Total de registros: ${totalResultados}`
                    }
                </Typography>
            </Stack>

                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50]}
                    autoHeight
                    loading={dataGridProps.loading || isDeleting}
                />
            </List>

            {/* Diálogo de Confirmación */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>¿Eliminar curso permanentemente?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Esta acción eliminará el curso y todas sus imágenes asociadas en Cloudflare de forma irreversible.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                            setOpenConfirm(false);
                            setIsDeleting(true);

                            mutate(
                                {
                                    resource: "curso",
                                    id: selectedId!,
                                    mutationMode: "pessimistic",
                                },
                                {
                                    onSuccess: () => {
                                        setIsDeleting(false);
                                        setSelectedId(null);
                                    },
                                    onError: () => {
                                        setIsDeleting(false);
                                    },
                                }
                            );
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};