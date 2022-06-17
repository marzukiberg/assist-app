import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    data: [],
    loading: true,
    error: null,
  },
  reducers: {
    setState: (state, action) => {
      state.data = action.payload.data;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
    getPegawai: (state, action) => {
      state.data = action.payload;
    },
    createPegawai: (state, action) => {
      state.data.pegawai.push(action.payload);
    },
    updatePegawai: (state, action) => {
      const idx = state.data.pegawai.findIndex(
        (item) => item.id === action.payload.id
      );
      state.data.pegawai[idx] = action.payload;
    },
    deletePegawai: (state, action) => {
      state.data.pegawai = state.data.pegawai.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  setState,
  getPegawai,
  createPegawai,
  updatePegawai,
  deletePegawai,
} = appSlice.actions;

export default appSlice.reducer;
