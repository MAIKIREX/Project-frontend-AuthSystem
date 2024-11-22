"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Mail } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

// Validación con Zod
const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Ingrese un email válido" }),
});

export default function ForgotPasswordPage() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        try {
            // Llamada al endpoint de recuperación de contraseña usando axiosInstance
            const response = await axiosInstance.post("/users/forgot-password", {
                email: data.email, // Enviar el email ingresado por el usuario
            });

            // Mensaje de éxito si la solicitud es exitosa
            setSuccessMessage("Se ha enviado un enlace de recuperación a tu correo electrónico.");
            setErrorMessage("");
        } catch (err) {
            // Manejo de errores, incluyendo mensajes personalizados desde el backend
            setSuccessMessage("");
            const errorMessage = err.response?.data?.message || "Ocurrió un error al enviar el correo. Intenta nuevamente.";
            setErrorMessage(errorMessage);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-50 p-10 shadow-md dark:bg-gray-800">
                {/* Encabezado */}
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-accent-500">
                        Recuperar contraseña
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Ingresa tu correo electrónico y te enviaremos un enlace
                        para restablecer tu contraseña.
                    </p>
                </div>

                {/* Formulario */}
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Campo de Email */}
                    <div className="rounded-md shadow-sm">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-3 items-center">
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="mt-1 bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                    placeholder="Ingresa tu correo electrónico"
                                />
                                <div className="p-2">
                                    <Mail />
                                </div>
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botón de Enviar */}
                    <div>
                        <Button variant="default" type="submit" className="w-full">
                            Enviar enlace de recuperación
                        </Button>
                    </div>
                </form>

                {/* Enlace de Volver al Login */}
                <div className="text-center">
                    <Link
                        href="/auth"
                        className="text-sm text-accent-500 hover:text-accent-400 dark:text-accent-400 dark:hover:text-accent-500"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>

                {/* Mensajes de Éxito o Error */}
                {successMessage && (
                    <Alert className="bg-green-600 text-gray-100 dark:bg-green-800 mt-4">
                        <AlertTitle>Éxito</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                {errorMessage && (
                    <Alert className="bg-red-600 text-gray-100 dark:bg-red-800 mt-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
