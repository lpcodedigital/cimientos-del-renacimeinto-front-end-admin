import React, { useState, useEffect } from "react";
import { DeleteButton, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import { Content, ObraResponseListDTO } from "../../interfaces/obra";
import { CanAccess, HttpError, useDelete } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Stack, Typography, TextField, InputAdornment } from "@mui/material";
import { StatusTag } from "../../components/obras/StatusTag";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";


export const ObraList = () => {

    const [openConfirm, setOpenConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { mutate } = useDelete()
    const [searchText, setSearchText] = useState("");

    // useDataGrid es un hook que facilita la integración con componentes de tabla, como DataGrid de MUI.
    // Al usarlo, puedes obtener automáticamente los datos, la paginación, los filtros y el ordenamiento
    // sin tener que escribir lógica adicional para manejar estos aspectos.
    // El tipo aquí es content, es lo que represenra cada fila de la tabla, y HttpError es el tipo de error que puede ocurrir al hacer la solicitud.
    const { dataGridProps, setFilters } = useDataGrid<Content, HttpError>({
        resource: "obra", // El nombre del recurso que quieres consultar. Refine usará esto para construir la URL de la API (e.g., /obra/list).
        pagination: {
            pageSize: 10, // Número de elementos por página
        },
        meta: {
            endpoint: "list", // Si tu API tiene un endpoint específico para listar, puedes especificarlo aquí. De lo contrario, se usará el endpoint por defecto.
        },
    });

    // Recuperamos de forma segura el total de elementos directo desde el hook de Refine
    const totalResultados = dataGridProps.rowCount ?? 0;

    const columns = React.useMemo<GridColDef<Content>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 70,
                type: "number",
                disableColumnMenu: true,
            },
            {
                field: "name",
                headerName: "Nombre",
                flex: 1,
                minWidth: 200,
                disableColumnMenu: true,
            },
            {
                field: "municipality",
                headerName: "Municipio",
                minWidth: 150,
                disableColumnMenu: true,
            },
            {
                field: "description",
                headerName: "Descripción",
                minWidth: 150,
                disableColumnMenu: true,
            },
            {
                field: "status",
                headerName: "Estado",
                minWidth: 150,
                disableColumnMenu: true,
                renderCell: ({ value }) => <StatusTag status={value} />,
            },
            {
                field: "progress",
                headerName: "Avance",
                type: "number",
                width: 100,
                disableColumnMenu: true,
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
                disableColumnMenu: true,
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

                            <CanAccess
                                resource="obra"
                                action="delete"
                                fallback={null}
                            >

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
                            </CanAccess>


                    </Stack>

                ),
                align: "center",
                headerAlign: "center",
                width: 150,
            },
        ],
        []
    )

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
                        placeholder="Buscar por nombre, municipio o descripción..."
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