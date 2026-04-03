import { DateField, DeleteButton, EditButton, EmailField, List, ShowButton, TagField, useDataGrid } from "@refinedev/mui";
import React from "react";
import { UserDTO } from "../../interfaces/user/user";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Chip, Stack, Typography } from "@mui/material";

export const UserList: React.FC = () => {

    const { dataGridProps } = useDataGrid<UserDTO>({
        syncWithLocation: true,
        meta: {
            endpoint: "list"
        },
        pagination: {
            pageSize: 10,
        }
    })

    const columns = React.useMemo<GridColDef<UserDTO>[]>( 
        () => [
            {
                field: "idUser",
                headerName: "ID",
                type: "number",
                width: 70,
            },
            {
                field: "fullName",
                headerName: "Nombre Completo",
                flex: 1,
                minWidth: 250,
                // Concatenamos nombre y apellidos del DTO
                valueGetter: (_, row) => 
                    `${row.name} ${row.middleName || ""} ${row.firstLastName} ${row.secondLastName}`.replace(/\s+/g, ' '),
                renderCell: ({ value }) => (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {value}
                    </Typography>
                ),
            },
            {
                field: "email",
                headerName: "Correo Electrónico",
                flex: 1,
                minWidth: 200,
                renderCell: ({ value }) => <EmailField value={value} />,
            },
            {
                field: "role",
                headerName: "Rol",
                width: 130,
                // Accedemos al objeto anidado RoleDTO
                renderCell: ({ value }) => (
                    <Chip 
                        label={value?.name || "Sin Rol"} 
                        size="small" 
                        color={value?.name === "ADMIN" ? "secondary" : "default"}
                        variant="outlined"
                    />
                ),
            },
            {
                field: "active",
                headerName: "Estatus",
                width: 100,
                renderCell: ({ value }) => (
                    <TagField 
                        value={value ? "Activo" : "Inactivo"} 
                        color={value ? "success" : "error"} 
                    />
                ),
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 150,
                align: "center",
                headerAlign: "center",
                renderCell: ({ row }) => (
                    <Stack direction="row" spacing={1}>
                        <EditButton hideText size="small" recordItemId={row.idUser} />
                        <ShowButton hideText size="small" recordItemId={row.idUser} />
                        <DeleteButton hideText size="small" recordItemId={row.idUser} />
                    </Stack>
                ),
            },
        ], [] 
    );

    return (
        <List title="Usuarios">
            <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
                getRowId={(row) => row.idUser}
                pageSizeOptions={[10, 20, 50]}
                loading={dataGridProps.loading}
                sx={{
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                    },
                    border: "none",
                }}

            />
        </List>
    );

};