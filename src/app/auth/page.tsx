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
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import useUserStore from "@/store/userStore"; // Store Zustand

// Validación con Zod
const loginSchema = z.object({
    email: z.string().email({ message: "Ingrese un email válido" }),
    password: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export default function LoginPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const { setUser } = useUserStore(); // Acceso al método para actualizar el store
    const [showPassword, setShowPassword] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post("/auth/login", {
                email: data.email,
                password: data.password,
            });

            // Extraer datos importantes de la respuesta
            const { email, role } = response.data.user;
            const token = response.data.access_token;

            // Guardar datos en Zustand
            setUser(email, role, token);

            setSuccess("Inicio de sesión exitoso");

            // Redirigir después del login
            setTimeout(() => router.push("/"), 2000);
        } catch (err) {
            setError("Credenciales inválidas");
            console.error("Error al iniciar sesión:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-50 p-10 shadow-md dark:bg-gray-800">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-accent-500">
                        Iniciar sesión
                    </h2>
                </div>
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-3 justify-center items-center">
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="mt-1 bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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
                        <div>
                            <Label htmlFor="password">Contraseña</Label>
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
                    </div>

                    <div>
                        <Button type="submit" variant={"Darkmode1"}>
                            Iniciar sesión
                        </Button>
                    </div>
                </form>

                <div className="text-center">
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-accent-500 hover:text-accent-400 dark:text-accent-400 dark:hover:text-accent-500"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                {error && (
                    <Alert
                        variant="destructive"
                        className="bg-red-600 text-gray-100 dark:bg-red-800"
                    >
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="bg-green-600 text-gray-100 dark:bg-green-800">
                        <AlertTitle>Éxito</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
