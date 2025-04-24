import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryFilter } from "../../types";

const initialState: CategoryFilter = {
  clt: true,
  pj: true,
  estudo: true,
  pessoal: true,
  social: true,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleCategoryFilter: (state, action: PayloadAction<Category>) => {
      state[action.payload] = !state[action.payload];
    },
    setCategoryFilter: (
      state,
      action: PayloadAction<{ category: Category; value: boolean }>
    ) => {
      state[action.payload.category] = action.payload.value;
    },
    resetFilters: () => initialState,
  },
});

export const { toggleCategoryFilter, setCategoryFilter, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
