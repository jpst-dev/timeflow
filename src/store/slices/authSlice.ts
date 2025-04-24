import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tipo para as informações básicas do usuário que queremos guardar
interface AuthUser {
  uid: string;
  email: string | null;
  // Adicione outras informações se necessário (displayName, photoURL, etc.)
}

// Tipo para o estado de autenticação
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "checked"; // 'checked' indica que o estado inicial do Firebase foi verificado
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle", // Começa como idle até o onAuthStateChanged rodar pela primeira vez
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Ação para definir o usuário quando o Firebase confirma o login
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; // True se user não for null, false caso contrário
      state.status = "checked"; // Marca que a verificação inicial foi feita
    },
    // Ação para limpar o estado de autenticação (logout)
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "checked"; // Mesmo no logout, a verificação foi feita
    },
    // Opcional: Ação para indicar que a verificação está em andamento
    setAuthLoading: (state) => {
      state.status = "loading";
    },
  },
});

export const { setUser, clearAuth, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;
