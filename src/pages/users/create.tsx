import { useForm } from "@refinedev/react-hook-form";
import { UserRequestDTO } from "../../interfaces/user/user";
import { Create, useAutocomplete } from "@refinedev/mui";
import { Box, Stack, TextField, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import { RoleDTO } from "../../interfaces/role/role";

export const UserCreate: React.FC = () => {
    const {
        saveButtonProps,
        register,
        control,
        formState: { errors },
        setValue,
    } = useForm<UserRequestDTO>({
        refineCoreProps: {
            resource: "user",
            action: "create",
            meta: {
                endpoint: "create",
            },
            redirect: "list",
        }
    });

    // Hook para cargar los roles disponibles desde /api/v1/role/list
    const { autocompleteProps: roleAutocompleteProps } = useAutocomplete({
        resource: "role",
        meta: {
            endpoint: "list",
        },
        // Mapeamos lo que el backend devuelve al formato que Autocomplete entiende
        defaultValue: [],
    });

    return (
        <Create saveButtonProps={saveButtonProps} title="Crear Nuevo Usuario">
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: "20px" }} >

                <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={2}
                >
                    <TextField
                        {...register("name", {required: "El nombre es obligatorio" })}
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                        label="Nombre"
                        fullWidth
                    />
                    <TextField
                        {...register("middleName",)}
                        label="Segundo Nombre (Opcional)"
                        fullWidth
                    />
                </Stack>

                <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={2}
                >
                    <TextField
                        {...register("firstLastName", {required: "El apellido paterno es obligatorio" })}
                        error={!!errors.firstLastName}
                        helperText={errors.firstLastName?.message as string}
                        label="Apellido Paterno"
                        fullWidth
                    />
                    <TextField
                        {...register("secondLastName", {required: "El apellido materno es obligatorio" })}
                        error={!!errors.secondLastName}
                        helperText={errors.secondLastName?.message as string}
                        label="Apellido Materno"
                        fullWidth
                    />
                </Stack>

                <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={2}
                >
                    <TextField
                        {...register("email", {required: "El correo electrónico es obligatorio", pattern: { value: /^\S+@\S+$/i, message: "El correo electrónico no es válido" } })}
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                        label="Correo Electrónico"
                        fullWidth
                    />
                </Stack>

                <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={2}
                >
                    <TextField
                        {...register("phone", {required: "El número de teléfono es obligatorio" })}
                        error={!!errors.phone}
                        helperText={errors.phone?.message as string}
                        label="Número de Teléfono"
                        type="tel"
                        fullWidth
                    />
                </Stack>

                <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={2}
                >
                    <TextField
                        {...register("password", {required: "La contraseña es obligatoria" })}
                        error={!!errors.password}
                        helperText={errors.password?.message as string}
                        label="Contraseña Temporal"
                        type="password"
                        fullWidth
                    />
                </Stack>

                <Autocomplete
                    {...roleAutocompleteProps}
                    getOptionLabel={(item: RoleDTO) => item.name || ""}
                    isOptionEqualToValue={(option, value) => option.idRole === value.idRole}
                    onChange= {(_, value)  => {
                        // Enviamos el idRole como Long al backend no el objeto completo
                        setValue("roleId", value?.idRole || 0);
                    }}
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            label="Asignar Rol"
                            margin="normal"
                            variant="outlined"
                            error={!!errors.roleId}
                            helperText={errors.roleId ? "El rol es obligatorio" : ""}
                            fullWidth
                            required
                        />
                    )}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            {...register("active")}
                            defaultChecked={true}
                        />
                    }
                    label="Usuario activo al crear"
                />

            </Box>
        </Create>
    );

};