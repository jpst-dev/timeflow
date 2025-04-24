import { configureStore, combineReducers } from "@reduxjs/toolkit";
import timeBlocksReducer from "./slices/timeBlocksSlice";
import filtersReducer from "./slices/filtersSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeBlock } from "../types";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Usa localStorage por padrão

const initialState = {
  blocks: [] as TimeBlock[],
};

// Configuração do redux-persist
const persistConfig = {
  key: "root", // Chave raiz no localStorage
  storage,
  whitelist: ["timeBlocks", "filters", "theme", "auth"], // Slices que serão persistidos
};

// Combina os reducers
const rootReducer = combineReducers({
  timeBlocks: timeBlocksReducer,
  filters: filtersReducer,
  theme: themeReducer,
  auth: authReducer,
});

// Cria o reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Usa o reducer persistido
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora ações específicas do redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Cria o persistor
export const persistor = persistStore(store);

// Tipos (ajustados para o rootReducer original se necessário, mas geralmente funciona)
export type RootState = ReturnType<typeof rootReducer>; // Usar rootReducer para o tipo
export type AppDispatch = typeof store.dispatch;

export const timeBlocksSlice = createSlice({
  name: "timeBlocks",
  initialState,
  reducers: {
    updateTimeBlock: (state, action: PayloadAction<TimeBlock>) => {
      const index = state.blocks.findIndex(
        (block) => block.id === action.payload.id
      );
      if (index !== -1) {
        state.blocks[index] = action.payload;
      }
    },
    deleteTimeBlock: (state, action: PayloadAction<string>) => {
      state.blocks = state.blocks.filter(
        (block) => block.id !== action.payload
      );
    },
  },
});

export const { updateTimeBlock, deleteTimeBlock } = timeBlocksSlice.actions;
