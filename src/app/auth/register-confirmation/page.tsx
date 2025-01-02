import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterConfirmationPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-50 p-10 text-center shadow-md dark:bg-gray-800">
                <h2 className="mt-6 text-3xl font-extrabold text-accent-500">
                    Confirma tu correo electrónico
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Hemos enviado un enlace de confirmación a tu correo
                    electrónico. Por favor, verifica tu bandeja de entrada y haz
                    clic en el enlace para activar tu cuenta.
                </p>
                <div className="mt-6">
                    <Link href="/">
                        <Button
                            variant={"Darkmode1"}
                        >
                            Volver al inicio de sesión
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
