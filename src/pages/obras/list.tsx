import React from "react";
import { DeleteButton, EditButton, List, ShowButton, useDataGrid } from "@refinedev/mui";
import { Content, ObraResponseListDTO } from "../../interfaces/obra";
import { HttpError } from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, LinearProgress, Typography } from "@mui/material";
import { StatusTag } from "../../components/obras/StatusTag";
export const ObraList = () => {

    // useDataGrid es un hook que facilita la integración con componentes de tabla, como DataGrid de MUI.
    // Al usarlo, puedes obtener automáticamente los datos, la paginación, los filtros y el ordenamiento
    // sin tener que escribir lógica adicional para manejar estos aspectos.
    // El tipo aquí es content, es lo que represenra cada fila de la tabla, y HttpError es el tipo de error que puede ocurrir al hacer la solicitud.
    const {dataGridProps} = useDataGrid<Content, HttpError>({
        resource: "obra", // El nombre del recurso que quieres consultar. Refine usará esto para construir la URL de la API (e.g., /obra/list).
        pagination: {
            pageSize: 10, // Número de elementos por página
        }
        
    });
    //console.log(dataGridProps.rows);

    const columns =React.useMemo<GridColDef<Content>[]>(
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
                renderCell: ({ value }) => (
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
                    <>
                    <EditButton hideText size="small" recordItemId={row.id} />
                    <ShowButton hideText size="small" recordItemId={row.id} /> 
                    <DeleteButton hideText size="small" recordItemId={row.id} />
                    </>
                ),
                align: "center",
                headerAlign: "center",
                width: 150,
            },
        ],
        []
    )


    return (
        <List title="Obras">
            <DataGrid {...dataGridProps} columns={columns} />
        </List>
    );
}