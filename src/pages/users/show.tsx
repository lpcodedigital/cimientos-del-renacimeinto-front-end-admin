import { 
    Show, 
    EmailField, 
    BooleanField, 
    DateField,
    TagField
} from "@refinedev/mui";
import { Typography, Stack, Card, CardContent, Grid, Divider, Chip, Box, Grid2, TextField } from "@mui/material";
import { useShow } from "@refinedev/core";
import { UserDTO } from "../../interfaces/user/user";

export const UserShow = () => {
    const { query } = useShow<UserDTO>({
        meta: {
            endpoint: "detail" // 💡 Fuerza a que use /api/v1/user/detail/:id
        }
    });
    
    const { data, isLoading, isError } = query;
    const record = data?.data;

     // Validar si ocurrió un error al cargar la obra, y mostrar un mensaje amigable en caso de que así sea.
        if (isError) {
            return (
                <Box sx={{ p: 2, bgcolor: "error.main", color: "white", borderRadius: 2 }}>
                    <Typography variant="h6">Error al cargar el usuario</Typography>
                    <Typography variant="body2">Inténtalo de nuevo más tarde.</Typography>
                </Box>
            );
        }

    return (
        <Show isLoading={isLoading} title={<Typography variant="h5">Detalle del Usuario</Typography>}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack spacing={2} alignItems="center">
                                {/* poner un Avatar aquí luego */}
                                <Typography variant="h6">{record?.name} {record?.middleName} {record?.firstLastName} {record?.secondLastName}</Typography>
                                <TagField 
                                    value={record?.role?.name} 
                                    color="secondary" 
                                    sx={{ fontWeight: 'bold' }} 
                                />
                                <Chip 
                                    label={record?.active ? "CUENTA ACTIVA" : "CUENTA INACTIVA"} 
                                    color={record?.active ? "success" : "error"}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">CORREO ELECTRÓNICO</Typography>
                            <EmailField value={record?.email} sx={{ fontSize: '1.1rem', display: 'block' }} />
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="caption" color="text.secondary">TELÉFONO</Typography>
                            <TextField value={record?.phone || "No registrado"} sx={{ display: 'block' }} />
                        </Box>

                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs:6 }}>
                                <Typography variant="caption" color="text.secondary">FECHA DE REGISTRO</Typography>
                                <DateField value={record?.createdAt} format="LLL" sx={{ display: 'block' }} />
                            </Grid2>
                            <Grid2 size={{ xs:6 }}>
                                <Typography variant="caption" color="text.secondary">ÚLTIMA ACTUALIZACIÓN</Typography>
                                
                                <DateField value={record?.updatedAt} format="LLL" sx={{ display: 'block' }} />
                                
                            </Grid2>
                        </Grid2>

                        <Divider />

                        <Stack direction="row" spacing={4}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">2FA HABILITADO</Typography>
                                <BooleanField value={record?.twoFactorEnabled} sx={{ display: 'block' }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">PRIMER LOGIN PENDIENTE</Typography>
                                <BooleanField value={record?.isFirstLogin} sx={{ display: 'block' }} />
                            </Box>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Show>
    );
};