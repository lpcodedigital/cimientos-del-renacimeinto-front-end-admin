import { useForm } from "@refinedev/react-hook-form"
import { UserDTO, UserRequestDTO } from "../../interfaces/user/user";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { Autocomplete, Backdrop, Box, Checkbox, CircularProgress, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import { RoleDTO } from "../../interfaces/role/role";

export const UserEdit: React.FC = () => {

    const {
        saveButtonProps,
        register,
        formState: { errors },
        setValue,
        refineCore: { query, formLoading },
    } = useForm<UserDTO, any, UserRequestDTO>({
        refineCoreProps: {
            resource: "user",
            action: "edit",
            //meta: {
            //    // Refine usará /detail/{id} para cargar y /update/{id} para guardar
            //    endpoint: "update"
            //},
            redirect: "list"

        }
    });

    // Cargamos los roles para el selector
    const { autocompleteProps: roleAutoCompleteProps } = useAutocomplete<RoleDTO>({
        resource: "role",
        meta: {
            endpoint: "list",
        }
    });

    const userData = query?.data?.data;

    //Determinamos mensaje dinamico
    const loadingMessage = query?.isLoading 
        ? "Cargando datos del usuario..." 
        : "Actualizando información del usuario...";

    return (
        <>
            {/* Este overlay se muestra mientras se guarda el formulario */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: "column",
                }}
                // Se abre si está cargando los datos iniciales O si está guardando
                open={query?.isLoading || formLoading}
            >
                <CircularProgress color="inherit" />
                <Stack
                    sx={{
                        mt: 2
                    }}
                    alignItems="center"
                >
                    <Typography variant="h6">
                       {loadingMessage}
                    </Typography>
                    <Typography variant="caption">
                        Esto puede tardar unos segundos.
                    </Typography>
                </Stack>
            </Backdrop>
            <Edit
                saveButtonProps={saveButtonProps}
                title="Editar Usuario"
                isLoading={query?.isLoading}
            >
                <Box
                    component="form"
                    sx={{ display: "flex", flexDirection: "column", gap: "20px" }}

                >

                    <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                        spacing={2}
                    >
                        <TextField
                            {...register("name", { required: "El nombre es obligatorio" })}
                            error={!!errors.name}
                            helperText={errors.name?.message as string}
                            label="Nombre"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }} // Asegura que el label se mantenga arriba
                        />
                        <TextField
                            {...register("middleName",)}
                            label="Segundo Nombre (Opcional)"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }} // Asegura que el label se mantenga arriba
                        />
                    </Stack>

                    <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                        spacing={2}
                    >
                        <TextField
                            {...register("firstLastName", { required: "El apellido paterno es obligatorio" })}
                            error={!!errors.firstLastName}
                            helperText={errors.firstLastName?.message as string}
                            label="Apellido Paterno"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }} // Asegura que el label se mantenga arriba
                        />
                        <TextField
                            {...register("secondLastName", { required: "El apellido materno es obligatorio" })}
                            error={!!errors.secondLastName}
                            helperText={errors.secondLastName?.message as string}
                            label="Apellido Materno"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }} // Asegura que el label se mantenga arriba
                        />
                    </Stack>

                    <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                        spacing={2}
                    >
                        <TextField
                            {...register("email", { required: "El correo electrónico es obligatorio", pattern: { value: /^\S+@\S+$/i, message: "El correo electrónico no es válido" } })}
                            error={!!errors.email}
                            helperText={errors.email?.message as string}
                            label="Correo Electrónico"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }} // Asegura que el label se mantenga arriba
                        />
                    </Stack>

                    <Stack direction={{
                        xs: "column",
                        md: "row",
                    }}
                        spacing={2}
                    >
                        <TextField
                            {...register("phone", { required: "El número de teléfono es obligatorio" })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message as string}
                            label="Número de Teléfono"
                            type="tel"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }} // Asegura que el label se mantenga arriba
                        />
                    </Stack>

                    <Autocomplete
                        {...roleAutoCompleteProps}
                        // Buscamos el objeto de rol que coincida con el rol del usuario cargado
                        value={
                            roleAutoCompleteProps.options?.find(
                                (role) => role.idRole === userData?.role.idRole
                            ) || null
                        }
                        getOptionLabel={(item: RoleDTO) => item.name || ""}
                        isOptionEqualToValue={(option, value) => option.idRole === value.idRole}
                        onChange={(_, value) => {
                            // Enviamos el idRole como Long al backend no el objeto completo
                            setValue("roleId", value?.idRole || 0);
                        }}
                        renderInput={(params: any) => (
                            <TextField
                                {...params}
                                label="Cambiar Rol"
                                //margin="normal"
                                variant="outlined"
                                //error={!!errors.roleId}
                                //helperText={errors.roleId ? "El rol es obligatorio" : ""}
                                fullWidth
                                required
                            />
                        )}
                    />

                    <Stack
                        direction="row" spacing={4}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...register("active")}
                                    defaultChecked={userData?.active} // El checkbox reflejará el estado actual del usuario
                                />
                            }
                            label="Usuario activo"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...register("twoFactorEnabled")}
                                    defaultChecked={userData?.twoFactorEnabled} // El checkbox reflejará el estado actual del usuario
                                />
                            }
                            label="2FA Habilitado"
                        />
                    </Stack>

                </Box>

            </Edit>
        </>
    );

}