import { Box, Button, TextField, Typography, Card, Container, Backdrop, CircularProgress } from "@mui/material";
import { useCustomMutation, useGo, useNavigation } from "@refinedev/core";
import { useForm } from "react-hook-form";

export const UpdatePassword: React.FC = () => {
    const go  = useGo();
    const { mutate, mutation } = useCustomMutation();
    const { isPending } = mutation;

    // 1. Obtenemos el usuario del localStorage
    const userStr = localStorage.getItem("sib-user-data");
    const user = JSON.parse(userStr || "{}");
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (values: any) => {

        // 2. Verificación de seguridad: si no hay ID, no disparamos la mutación
        if (!user.idUser) {
            console.error("No se encontró el ID del usuario en el storage");
            return;
        }

        // 3. Actualizamos el password
        mutate({
            url: `user/update-password/${user.idUser}`,
            method: "put",
            values: { password: values.newPassword },
        }, {
            onSuccess: () => {
                // 💡 IMPORTANTE: Actualizamos el local para que no lo rebote de nuevo
                user.isFirstLogin = false;
                localStorage.setItem("sib-user-data", JSON.stringify(user));
                go({to: "/"});
            },
            onError: (error: any) => {
                // Opcional: podrías mostrar una notificación de error aquí
                console.error("Error al actualizar contraseña:", error);
            }
        });
    };

    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Backdrop sx={{ color: '#fff', zIndex: 10 }} open={isPending}>
                <CircularProgress color="inherit" />
                <Typography sx={{ ml: 2 }}>Actualizando credenciales...</Typography>
            </Backdrop>
            
            <Container maxWidth="xs">
                <Card sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
                        Nueva Contraseña
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                        Por seguridad, debes cambiar tu clave temporal para activar tu cuenta.
                    </Typography>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register("newPassword", { required: "Campo obligatorio", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                            label="Contraseña Nueva"
                            type="password"
                            fullWidth
                            margin="normal"
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message as string}
                        />
                        <TextField
                            {...register("confirmPassword", {
                                required: "Campo obligatorio",
                                validate: (v) => v === watch("newPassword") || "No coinciden"
                            })}
                            label="Repetir Contraseña"
                            type="password"
                            fullWidth
                            margin="normal"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message as string}
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5 }}>
                            Activar Cuenta
                        </Button>
                    </form>
                </Card>
            </Container>
        </Box>
    );
};