import React, { useState } from "react";
import { DeleteButton, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import { Content, ObraResponseListDTO } from "../../interfaces/obra";
import { HttpError, useDelete } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import { StatusTag } from "../../components/obras/StatusTag";

import DeleteIcon from "@mui/icons-material/Delete";
export const ObraList = () => {

    const [openConfirm, setOpenConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { mutate } = useDelete()

    // useDataGrid es un hook que facilita la integración con componentes de tabla, como DataGrid de MUI.
    // Al usarlo, puedes obtener automáticamente los datos, la paginación, los filtros y el ordenamiento
    // sin tener que escribir lógica adicional para manejar estos aspectos.
    // El tipo aquí es content, es lo que represenra cada fila de la tabla, y HttpError es el tipo de error que puede ocurrir al hacer la solicitud.
    const { dataGridProps } = useDataGrid<Content, HttpError>({
        resource: "obra", // El nombre del recurso que quieres consultar. Refine usará esto para construir la URL de la API (e.g., /obra/list).
        pagination: {
            pageSize: 10, // Número de elementos por página
        },
        meta: {
            endpoint: "list", // Si tu API tiene un endpoint específico para listar, puedes especificarlo aquí. De lo contrario, se usará el endpoint por defecto.
        },

    });

    const columns = React.useMemo<GridColDef<Content>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 70,
                type: "number",
            },
            {
                field: "name",
                headerName: "Nombre",
                flex: 1,
                minWidth: 200,
            },
            {
                field: "municipality",
                headerName: "Municipio",
                minWidth: 150,
            },
            {
                field: "description",
                headerName: "Descripción",
                minWidth: 150,
            },
            {
                field: "status",
                headerName: "Estado",
                minWidth: 150,
                renderCell: ({ value }) => <StatusTag status={value} />,
            },
            {
                field: "progress",
                headerName: "Avance",
                type: "number",
                width: 100,
                renderCell: ({ value }: any) => (
                    <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
                        <Box>
                            <LinearProgress
                                variant="determinate"
                                value={value}
                                sx={{ height: 8, borderRadius: 5 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {`${value}%`}
                        </Typography>
                    </Box>
                ),
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                renderCell: ({ row }) => (
                    <Stack
                        direction="row"
                        spacing={1}
                    >

                        <EditButton hideText size="small" recordItemId={row.id} />
                        <ShowButton hideText size="small" recordItemId={row.id} />

                        {/* BOTÓN DE BORRADO:
                            - 'confirmTitle': Personaliza el mensaje.
                            - 'confirmOkText': Botón de acción.
                            - 'mutationMode': 'pessimistic' asegura que primero se borre en el server 
                              antes de quitarlo de la lista.
                        <DeleteButton 
                            hideText 
                            size="small" 
                            recordItemId={row.id} 
                            confirmTitle="¿Eliminar obra permanentemente?"
                            confirmOkText="Eliminar"
                            confirmCancelText="Cancelar"
                            mutationMode="pessimistic"
                        />
                        */}
                        {/* Usamos un IconButton normal en lugar del DeleteButton de Refine 
            para tener el control total del evento */}
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

                    </Stack>

                ),
                align: "center",
                headerAlign: "center",
                width: 150,
            },
        ],
        []
    )


    return (
        <>
            {/* Backdrop de seguridad para el borrado remoto */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: "column",
                    backdropFilter: "blur(4px)", // Añadimos un desenfoque para que se vea pro
                }}
                open={isDeleting}
            >
                <CircularProgress color="inherit" />
                <Stack sx={{ mt: 2 }} alignItems="center" spacing={1}>
                    <Typography variant="h6">
                        Eliminando obra y liberando almacenamiento...
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Estamos eliminando las evidencias del alamacenamiento remoto de forma segura.
                    </Typography>
                </Stack>
            </Backdrop>

            <List title="Obras">
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    loading={dataGridProps.loading || isDeleting}
                />
            </List>

            {/* 1. DIÁLOGO DE CONFIRMACIÓN MANUAL */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>¿Eliminar obra permanentemente?</DialogTitle>
                <DialogContent>
                    <Typography>Esta acción eliminará la obra de Mérida y sus imágenes en Cloudflare.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                            setOpenConfirm(false); // 1. Cerramos el diálogo
                            setIsDeleting(true);    // 2. Activamos Backdrop

                            // Llamada a mutate con dos objetos separados
                            mutate(
                                {
                                    resource: "obra",
                                    id: selectedId!,
                                    mutationMode: "pessimistic",
                                },
                                {
                                    onSuccess: () => {
                                        setIsDeleting(false);
                                    },
                                    onError: () => {
                                        setIsDeleting(false);
                                    },
                                    onSettled: () => {
                                        setIsDeleting(false);
                                    }
                                }
                            ); // <-- Cierre del mutate
                        }} // <-- Cierre del onClick
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
}