import React, { useEffect } from "react";
import Pegawai from "./pages/pegawai";
import { useDispatch } from "react-redux";
import { setState } from "./redux/reducer";
import { useFetch } from "./hooks";
import { BASE_URL, API_DAERAH } from "./utils/constant";

export default function App() {
  const { data, loading, error } = useFetch(BASE_URL + "pegawai");
  const { data: provinsi } = useFetch(API_DAERAH + "provinsi");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setState({
        data: {
          provinsi: provinsi.provinsi,
          pegawai: data,
        },
        loading,
        error,
      })
    );
  }, [data, provinsi]);

  return <Pegawai />;
}
