import { configureStore } from "@reduxjs/toolkit";
import pegawaiReducer from "./reducer";

export default configureStore({
  reducer: {
    pegawai: pegawaiReducer,
  },
});
