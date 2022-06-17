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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteCustom } from "../../components";
import { updatePegawai } from "../../redux/reducer";
import { API_DAERAH, BASE_URL, boxModalStyle } from "../../utils/constant";
import { getData } from "../../utils/get-data";

const EditModal = ({ open, setOpen, editData }) => {
  const { data } = useSelector((state) => state.pegawai);
  const dataProvinsi = data.provinsi;
  const [dataKabupaten, setDataKabupaten] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataKelurahan, setDataKelurahan] = useState([]);
  const [form, setForm] = useState({
    nama: editData.nama,
    provinsi: editData.provinsi,
    kabupaten: editData.kabupaten,
    kecamatan: editData.kecamatan,
    kelurahan: editData.kelurahan,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);
  const handleEdit = async () => {
    const dataId = editData.id;
    try {
      setLoading(true);
      await fetch(BASE_URL + "pegawai/" + dataId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      alert("Data berhasil diubah");
      dispatch(
        updatePegawai({
          ...form,
          id: dataId,
        })
      );
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getKabupaten = async (id) => {
    const kabupaten = await getData(API_DAERAH + "kota?id_provinsi=" + id);
    setDataKabupaten(kabupaten.kota_kabupaten);
    const idKabupaten = kabupaten.kota_kabupaten.find(
      (item) => item.nama === editData.kabupaten
    )?.id;
    getKecamatan(idKabupaten);
  };
  const getKecamatan = async (id) => {
    const kecamatan = await getData(API_DAERAH + "kecamatan?id_kota=" + id);
    setDataKecamatan(kecamatan.kecamatan);
    const idKecamatan = kecamatan.kecamatan.find(
      (item) => item.nama === editData.kecamatan
    )?.id;
    getKelurahan(idKecamatan);
  };
  const getKelurahan = async (id) => {
    const kelurahan = await getData(
      API_DAERAH + "kelurahan?id_kecamatan=" + id
    );
    setDataKelurahan(kelurahan.kelurahan);
  };

  useEffect(() => {
    const { provinsi } = editData;
    if (provinsi) {
      const idProvinsi = dataProvinsi.find(
        (item) => item.nama === provinsi
      )?.id;
      getKabupaten(idProvinsi);
    }
  }, [editData]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxModalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Pegawai
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Lengkapi form untuk memperbarui pegawai.
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
              defaultValue={editData.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
            <AutocompleteCustom
              options={dataProvinsi}
              label="Provinsi"
              optionLabel="nama"
              onChange={(e, value) => {
                setForm({ ...form, provinsi: value.nama });
                getKabupaten(value.id);
              }}
              defaultValue={{ nama: editData.provinsi }}
            />
            <AutocompleteCustom
              disabled={!dataKabupaten.length}
              options={dataKabupaten}
              label="Kabupaten"
              optionLabel="nama"
              onChange={(e, value) => {
                setForm({ ...form, kabupaten: value.nama });
                getKecamatan(value.id);
              }}
              defaultValue={{ nama: editData.kabupaten }}
            />
            <AutocompleteCustom
              disabled={!dataKecamatan.length}
              options={dataKecamatan}
              label="Kecamatan"
              optionLabel="nama"
              onChange={(e, value) => {
                setForm({ ...form, kecamatan: value.nama });
                getKelurahan(value.id);
              }}
              defaultValue={{ nama: editData.kecamatan }}
            />
            <AutocompleteCustom
              disabled={!dataKelurahan.length}
              options={dataKelurahan}
              label="Kelurahan"
              optionLabel="nama"
              onChange={(e, value) => {
                setForm({ ...form, kelurahan: value.nama });
              }}
              defaultValue={{ nama: editData.kelurahan }}
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
              onClick={handleEdit}
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

export default EditModal;
