import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteCustom } from "../../components";
import { createPegawai } from "../../redux/reducer";
import { API_DAERAH, BASE_URL, boxModalStyle } from "../../utils/constant";
import { getData } from "../../utils/get-data";

const CreateModal = ({ open, setOpen }) => {
  const { data } = useSelector((state) => state.pegawai);
  const dataProvinsi = data.provinsi;
  const [dataKabupaten, setDataKabupaten] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataKelurahan, setDataKelurahan] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getKabupaten = async (id) => {
    const kabupaten = await getData(API_DAERAH + "kota?id_provinsi=" + id);
    setDataKabupaten(kabupaten.kota_kabupaten);
  };
  const getKecamatan = async (id) => {
    const kecamatan = await getData(API_DAERAH + "kecamatan?id_kota=" + id);
    setDataKecamatan(kecamatan.kecamatan);
  };
  const getKelurahan = async (id) => {
    const kelurahan = await getData(
      API_DAERAH + "kelurahan?id_kecamatan=" + id
    );
    setDataKelurahan(kelurahan.kelurahan);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    Object.keys(form).forEach((key) => {
      if (form[key] === "") {
        setError(true);
      } else {
        setError(false);
      }
    });
    if (!error) {
      setLoading(true);
      try {
        const response = await fetch(BASE_URL + "pegawai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        const status = await response.status;
        const json = await response.json();
        if (status === 201) {
          alert("Data berhasil ditambahkan");
          setOpen(false);
          dispatch(createPegawai(json));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxModalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Tambah Pegawai
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Lengkapi form dibawah ini untuk menambahkan pegawai baru.
        </Typography>

        <Divider sx={{ my: 2 }} />
        {/* alert */}
        {error && <Alert severity="error">Form tidak boleh kosong!</Alert>}
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "100%" },
          }}
        >
          <div>
            <TextField
              variant="standard"
              label="Nama"
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
            <AutocompleteCustom
              options={dataProvinsi}
              optionLabel="nama"
              onChange={(event, value) => {
                getKabupaten(value.id);
                setForm({ ...form, provinsi: value.nama });
              }}
              label="Provinsi"
            />
            <AutocompleteCustom
              disabled={dataKabupaten.length === 0}
              options={dataKabupaten}
              optionLabel="nama"
              onChange={(event, value) => {
                getKecamatan(value.id);
                setForm({ ...form, kabupaten: value.nama });
              }}
              label="Kabupaten"
            />
            <AutocompleteCustom
              disabled={dataKecamatan.length === 0}
              options={dataKecamatan}
              optionLabel="nama"
              label="Kecamatan"
              onChange={(e, value) => {
                getKelurahan(value.id);
                setForm({ ...form, kecamatan: value.nama });
              }}
            />
            <AutocompleteCustom
              disabled={dataKelurahan.length === 0}
              options={dataKelurahan}
              optionLabel="nama"
              label="Kelurahan"
              onChange={(e, value) =>
                setForm({ ...form, kelurahan: value.nama })
              }
            />
          </div>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ mr: 2 }}>
            <LoadingButton
              loading={loading}
              loadingIndicator="Loading..."
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              Simpan
            </LoadingButton>
          </Box>
          <Box>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Batal
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateModal;
