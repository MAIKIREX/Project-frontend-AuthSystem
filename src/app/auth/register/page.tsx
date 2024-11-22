"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import useUserStore from "@/store/userStore"; // Importar Zustand

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; // Importa el componente Select de ShadCN

// Esquema de validación actualizado
const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
        lastname: z
            .string()
            .min(2, {
                message: "El apellido debe tener al menos 2 caracteres",
            }),
        email: z.string().email({ message: "Ingrese un email válido" }),
        password: z
            .string()
            .min(6, {
                message: "La contraseña debe tener al menos 6 caracteres",
            }),
        confirmPassword: z.string(),
        role: z.string(), // Campo de rol como string
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(true);

    const { role: userRole } = useUserStore(); // Obtener el rol del usuario logueado desde Zustand

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "customer", // Rol por defecto
        },
    });

    // Mostrar el campo de rol solo si el usuario logueado es admin
    const showRoleField = userRole === "admin";

    useEffect(() => {
        // Si no es admin, asignar "customer" como valor predeterminado
        if (!showRoleField) {
            setValue("role", "customer");
        }
    }, [showRoleField, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post("/users", {
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                role: data.role, // Enviar el rol seleccionado o el predeterminado
            });

            setSuccess(
                "Registro exitoso. Por favor, verifica tu correo electrónico."
            );
            setTimeout(() => router.push("/auth"), 2000);
        } catch (err) {
            setError("Error al registrar el usuario. Inténtalo nuevamente.");
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-50 p-10 shadow-md dark:bg-gray-800">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-accent-500">
                        Crear cuenta
                    </h2>
                </div>
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4 rounded-md shadow-sm">
                        {/* Campo de Nombre */}
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <div className="flex gap-3 items-center">
                                <Input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    className="mt-1 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                />
                                <div className="p-2 text-gray-500">
                                    <User />
                                </div>
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Campo de Apellido */}
                        <div>
                            <Label htmlFor="lastname">Apellido</Label>
                            <div className="flex gap-3 items-center">
                                <Input
                                    id="lastname"
                                    type="text"
                                    {...register("lastname")}
                                    className="mt-1 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                />
                                <div className="p-2 text-gray-500">
                                    <User />
                                </div>
                            </div>
                            {errors.lastname && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.lastname.message}
                                </p>
                            )}
                        </div>

                        {/* Campo de Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-3 items-center">
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="mt-1 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                />
                                <div className="p-2 text-gray-500">
                                    <Mail />
                                </div>
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Campo de Rol (Solo visible para admin) */}
                        {showRoleField && (
                            <div>
                                <Label htmlFor="role">Rol</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setValue("role", value)
                                    }
                                    defaultValue="customer"
                                >
                                    <SelectTrigger className="mt-1 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="customer">
                                            Customer
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {errors.role.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Campo de Contraseña */}
                        <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="flex gap-3 items-center">
                                <Input
                                    id="password"
                                    type={showPassword ? "password" : "text"}
                                    {...register("password")}
                                    className="mt-1 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="p-2 text-gray-900 dark:text-gray-100 hover:text-accent-500 dark:hover:text-accent-400"
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

                        {/* Campo de Confirmar Contraseña */}
                        <div>
                            <Label htmlFor="confirmPassword">
                                Confirmar Contraseña
                            </Label>
                            <div className="flex gap-3 items-center">
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "password" : "text"}
                                    {...register("confirmPassword")}
                                    className="mt-1 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="p-2 text-gray-900 dark:text-gray-100 hover:text-accent-500 dark:hover:text-accent-400"
                                >
                                    {showPassword ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botón de Registro */}
                    <div>
                        <Button type="submit" variant={"Darkmode1"}>
                            Registrarse
                        </Button>
                    </div>
                </form>

                {/* Mensajes de Error/Éxito */}
                {error && (
                    <Alert
                        variant="destructive"
                        className="bg-red-600 dark:bg-red-800 text-gray-100"
                    >
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="bg-green-600 dark:bg-green-800 text-gray-100">
                        <AlertTitle>Éxito</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
