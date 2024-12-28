import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface PerPageState {
  value: number;
}

const initialState: PerPageState = {
  value: 10,
};

export const perPageSlice = createSlice({
  name: "perPage",
  initialState,
  reducers: {
    setPerPage: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setPerPage } = perPageSlice.actions;

export const selectPerPage = (state: RootState) => {
  return state.perPage.value;
};

export default perPageSlice.reducer;
