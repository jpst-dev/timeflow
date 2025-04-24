import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeBlock } from "../../types";
import { addDays, setHours, setMinutes } from "date-fns";

// Gera alguns blocos de exemplo para iniciar
const generateMockTimeBlocks = (): TimeBlock[] => {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  return [
    {
      id: "1",
      title: "Desenvolvimento Frontend",
      start: setMinutes(setHours(today, 9), 0),
      end: setMinutes(setHours(today, 12), 0),
      category: "clt",
      description: "Implementação de componentes React",
    },
    {
      id: "2",
      title: "Projeto Freelance",
      start: setMinutes(setHours(today, 14), 0),
      end: setMinutes(setHours(today, 16), 0),
      category: "pj",
      description: "Desenvolvimento de landing page",
    },
    {
      id: "3",
      title: "Curso de TypeScript",
      start: setMinutes(setHours(today, 16), 30),
      end: setMinutes(setHours(today, 18), 0),
      category: "estudo",
      description: "Módulo de generics e tipos avançados",
    },
    {
      id: "4",
      title: "Academia",
      start: setMinutes(setHours(today, 18), 30),
      end: setMinutes(setHours(today, 20), 0),
      category: "pessoal",
      description: "Treino de força",
    },
    {
      id: "5",
      title: "Reunião de Equipe",
      start: setMinutes(setHours(tomorrow, 10), 0),
      end: setMinutes(setHours(tomorrow, 11), 30),
      category: "clt",
      description: "Planejamento semanal",
    },
    {
      id: "6",
      title: "Leitura",
      start: setMinutes(setHours(tomorrow, 20), 0),
      end: setMinutes(setHours(tomorrow, 21), 30),
      category: "pessoal",
      description: "Livro: Clean Code",
    },
  ];
};

interface TimeBlocksState {
  blocks: TimeBlock[];
  loading: boolean;
  error: string | null;
}

const initialState: TimeBlocksState = {
  blocks: generateMockTimeBlocks(),
  loading: false,
  error: null,
};

const timeBlocksSlice = createSlice({
  name: "timeBlocks",
  initialState,
  reducers: {
    addTimeBlock: (state, action: PayloadAction<TimeBlock>) => {
      state.blocks.push(action.payload);
    },
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

export const { addTimeBlock, updateTimeBlock, deleteTimeBlock } =
  timeBlocksSlice.actions;
export default timeBlocksSlice.reducer;
