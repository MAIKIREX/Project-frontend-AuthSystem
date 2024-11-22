import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-secondary border-t border-secondary">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-secondary-foreground">
                        © 2024 AuthSystem. miguel angel tambo morales.
                    </p>
                    <div className="flex space-x-6">
                        <Link
                            href="/privacy"
                            className="text-sm text-secondary-foreground hover:text-primary"
                        >
                            Política de privacidad
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-secondary-foreground hover:text-primary"
                        >
                            Términos de servicio
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
