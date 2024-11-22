"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, {
            message: "La contraseña debe tener al menos 6 caracteres",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export default function ResetPasswordPage() {
    const [success, setSuccess] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const { token } = useParams(); // Capturar el token desde la URL dinámica
    const [showPassword, setShowPassword] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    // Validar el token al cargar la página
    useEffect(() => {
        const validateToken = async () => {
            try {
                await axiosInstance.post("/users/validate-reset-token", {
                    token,
                });
            } catch (error) {
                setErrorMessage(
                    "El token es inválido o ha expirado. Solicita un nuevo enlace."
                );
                setTimeout(() => router.push("/auth/forgot-password"), 3000);
            }
        };

        if (token) {
            validateToken();
        }
    }, [token, router]);

    const onSubmit = async (data) => {
        try {
            console.log("Token enviado:", token);
            await axiosInstance.post("/users/reset-password", {
                token,
                password: data.password,
            });
            setSuccess("Tu contraseña ha sido restablecida con éxito.");
            setErrorMessage("");
            setTimeout(() => router.push("/auth"), 2000);
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setErrorMessage(
                "Hubo un problema al restablecer tu contraseña. Intenta nuevamente."
            );
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-50 p-10 shadow-md dark:bg-gray-800">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-accent-500">
                        Restablecer contraseña
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Ingresa tu nueva contraseña.
                    </p>
                </div>
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Label htmlFor="password">Nueva contraseña</Label>
                            <div className="flex gap-3">
                                <Input
                                    id="password"
                                    type={showPassword ? "password" : "text"}
                                    {...register("password")}
                                    className="mt-1 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                    }}
                                    className="p-2 text-gray-900 dark:text-gray-100 hover:text-[#38bdf8] dark:hover:text-[#60cdfc]"
                                >
                                    {showPassword ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword">
                                Confirmar nueva contraseña
                            </Label>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "password" : "text"}
                                {...register("confirmPassword")}
                                className="mt-1 bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button type="submit" variant={"Darkmode1"}>
                            Restablecer contraseña
                        </Button>
                    </div>
                </form>

                {/* Mensajes de éxito o error */}
                {success && (
                    <Alert className="bg-green-600 text-gray-100 dark:bg-green-800">
                        <AlertTitle>Éxito</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}
                {errorMessage && (
                    <Alert className="bg-red-600 text-gray-100 dark:bg-red-800">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
