import React, { useState } from "react";
import { IResourceComponentsProps, useDelete, CanAccess, HttpError } from "@refinedev/core";
import { useDataGrid, List, DateField, EditButton, ShowButton } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { 
    Avatar, Typography, Stack, Box, Backdrop, CircularProgress, 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CursoResponseDTO } from "../../interfaces/curso/curso";

export const CursoList: React.FC<IResourceComponentsProps> = () => {
    // Estados para el control del borrado manual
    const [openConfirm, setOpenConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    
    const { mutate } = useDelete();

    const { dataGridProps } = useDataGrid<CursoResponseDTO, HttpError>({
        syncWithLocation: true,
        resource: "curso",
        meta: {
            endpoint: "list",
        },
    });

    const columns = React.useMemo<GridColDef<CursoResponseDTO>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                width: 50,
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
            },
            {
                field: "municipalityName",
                headerName: "Municipio",
                width: 150,
            },
            {
                field: "courseDate",
                headerName: "Fecha",
                width: 120,
                renderCell: ({ value }) => <DateField value={value} format="DD/MM/YYYY" />,
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
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
                <DataGrid 
                    {...dataGridProps} 
                    columns={columns} 
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