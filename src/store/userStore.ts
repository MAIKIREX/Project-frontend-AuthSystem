import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    email: string | null; // Identificador del usuario
    role: string | null;  // Permisos o rol del usuario
    token: string | null; // Token de autenticación
    setUser: (email: string, role: string, token: string) => void; // Establecer usuario
    clearUser: () => void; // Limpiar estado
}

const useUserStore = create(
    persist<UserState>(
        (set) => ({
            email: null,
            role: null,
            token: null,
            setUser: (email, role, token) => set({ email, role, token }),
            clearUser: () => set({ email: null, role: null, token: null }),
        }),
        {
            name: "user-store", // Clave para localStorage
            partialize: (state) => ({ email: state.email, role: state.role, token: state.token }), // Campos a persistir
        }
    )
);

export default useUserStore;
