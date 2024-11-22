"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ButtonDark";
import useUserStore from "@/store/userStore"; // Importar Zustand
import { ChevronDown } from 'lucide-react';

export function Navbar() {
    const { email, role, clearUser } = useUserStore(); // Extraer datos y métodos del store
    const router = useRouter();

    const handleLogout = () => {
        clearUser(); // Limpiar estado global
        router.push("/"); // Redirigir al login
    };

    return (
        <nav className="bg-secondary border-b dark:border-b-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-primary">
                    AuthSystem
                </Link>

                {/* Opciones dinámicas según el estado del usuario */}
                <div className="flex items-center space-x-4">
                    {!email ? (
                        <>
                            {/* Opciones para usuarios no autenticados */}
                            <Link href="/auth">
                                <Button variant="secondary">Iniciar sesión</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button variant="default">Registrarse</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Dropdown para usuarios autenticados */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="default" className="capitalize">
                                        Hola, {email.split("@")[0]} {/* Nombre basado en el email */}
                                        <ChevronDown/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {email}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Rol: {role}
                                        </p>
                                    </div>
                                    {(role == "admin") && <DropdownMenuItem asChild>
                                        <Link href="/auth/register" className="text-sm">
                                            Registrarse
                                        </Link>
                                    </DropdownMenuItem>}
                                    <DropdownMenuItem asChild>
                                        <Link href="/" className="text-sm">
                                            Mi Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/" className="text-sm">
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="text-sm text-red-600">
                                        Salir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                    {/* Botón de Modo Oscuro */}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
