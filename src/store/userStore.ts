import { create } from "zustand";

interface UserState {
    email: string | null; // Identificador del usuario
    role: string | null;  // Permisos o rol del usuario
    token: string | null; // Token de autenticación
    setUser: (email: string, role: string, token: string) => void; // Establecer usuario
    clearUser: () => void; // Limpiar estado
}

const useUserStore = create<UserState>((set) => ({
    email: null,
    role: null,
    token: null,
    setUser: (email, role, token) => set({ email, role, token }),
    clearUser: () => set({ email: null, role: null, token: null }),
}));

export default useUserStore;
