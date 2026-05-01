import React, { useState } from "react";
import { Box, Button, TextField, Typography, Card, Container, Stack } from "@mui/material";
import { useCustomMutation, useGo, useNotification } from "@refinedev/core";
import { useForm } from "react-hook-form";

export const ForgotPassword = () => {
    const go = useGo();
    const { open } = useNotification();
    const [isStepSent, setIsStepSent] = useState(false);
    const { mutate, mutation } = useCustomMutation();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSendEmail = (values: any) => {
        mutate({
            url: "auth/forgot-password", // Endpoint en tu Backend
            method: "post",
            values: { email: values.email },
        }, {
            onSuccess: () => {
                setIsStepSent(true);
                open?.({
                    type: "success",
                    message: "Correo enviado",
                    description: "Revisa tu bandeja de entrada para el código de recuperación."
                });
            }
        });
    };

    const onResetPassword = (values: any) => {
        mutate({
            url: "auth/reset-password",
            method: "post",
            values: { 
                email: values.email,
                code: values.code,
                newPassword: values.newPassword 
            },
        }, {
            onSuccess: () => {
                open?.({
                    type: "success",
                    message: "Contraseña actualizada",
                    description: "Ya puedes iniciar sesión con tu nueva clave."
                });
                go({ to: "/login" });
            }
        });
    };

    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Container maxWidth="xs">
                <Card sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
                        Recuperar Acceso
                    </Typography>

                    {!isStepSent ? (
                        /* PASO 1: Ingresar Email */
                        <form onSubmit={handleSubmit(onSendEmail)}>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Ingresa tu correo institucional para enviarte un código de recuperación.
                            </Typography>
                            <TextField
                                {...register("email", { required: "Obligatorio" })}
                                label="Correo Electrónico"
                                fullWidth
                                margin="normal"
                                error={!!errors.email}
                            />
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} loading={mutation.isPending}>
                                Enviar Código
                            </Button>
                        </form>
                    ) : (
                        /* PASO 2: Ingresar Código y Nueva Clave */
                        <form onSubmit={handleSubmit(onResetPassword)}>
                            <TextField
                                {...register("code", { required: "Ingresa el código enviado" })}
                                label="Código de Verificación"
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                {...register("newPassword", { required: "Mínimo 6 caracteres", minLength: 6 })}
                                label="Nueva Contraseña"
                                type="password"
                                fullWidth
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} loading={mutation.isPending}>
                                Restablecer Contraseña
                            </Button>
                        </form>
                    )}
                    
                    <Button fullWidth sx={{ mt: 2 }} onClick={() => go({ to: "/login" })}>
                        Volver al Login
                    </Button>
                </Card>
            </Container>
        </Box>
    );
};