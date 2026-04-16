import React from "react";
import { Box, Button, TextField, Typography, Card, Container, Backdrop, CircularProgress } from "@mui/material";
import { useCustomMutation, useGo } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { TOKEN_KEY, USER_KEY, MFA_EMAIL_KEY } from "../../providers/constants";
import { Verify2FAResponseDTO, LoginResponse } from "../../interfaces/auth";

export const Verify2FA: React.FC = () => {
    const go = useGo();
    const { mutate, mutation } = useCustomMutation();
    const { isPending } = mutation;
    
    // Obtenemos el email que guardamos en el login
    const mfaEmail = localStorage.getItem(MFA_EMAIL_KEY);

    const { register, handleSubmit, formState: { errors } } = useForm();

    // Si alguien intenta entrar a esta ruta sin haber pasado por el login, lo regresamos
    if (!mfaEmail) {
        go({ to: "/login" });
        return null;
    }

    const onSubmit = (values: any) => {

        const payload: Verify2FAResponseDTO = {
            email: mfaEmail,
            code: values.code
        };

        mutate({
            url: "auth/verify-2fa",
            method: "post",
            values: payload,
        }, {
            onSuccess: (response: any) => {
                const data = response.data as LoginResponse;
                // 1. Guardamos los datos finales
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                
                // 2. Limpiamos el email temporal
                localStorage.removeItem("sib_mfa_email");

                // 3. Verificamos si debe cambiar password o ir al inicio
                if (data.user.isFirstLogin) {
                    go({ to: "/update-password" });
                } else {
                    go({ to: "/" });
                }
            }
        });
    };

    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Backdrop sx={{ color: '#fff', zIndex: 10 }} open={isPending}>
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <Container maxWidth="xs">
                <Card sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
                        Verificación de Seguridad
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                        Hemos enviado un código de 6 dígitos a su correo institucional.
                    </Typography>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register("code", { 
                                required: "El código es obligatorio",
                                minLength: { value: 6, message: "Debe tener 6 dígitos" },
                                maxLength: { value: 6, message: "Debe tener 6 dígitos" }
                            })}
                            label="Código de 6 dígitos"
                            fullWidth
                            margin="normal"
                            autoFocus
                            error={!!errors.code}
                            helperText={errors.code?.message as string}
                            inputProps={{ textAlign: 'center', style: { letterSpacing: '5px', fontSize: '1.5rem' } }}
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5 }}>
                            Verificar y Entrar
                        </Button>
                    </form>
                </Card>
            </Container>
        </Box>
    );
};