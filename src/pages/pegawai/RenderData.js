import { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePegawai } from "../../redux/reducer";
import {
  Button,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL } from "../../utils/constant";
import EditModal from "./Edit";

const RenderData = ({ data }) => {
  const dispatch = useDispatch();
  const [modalEdit, setModalEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [modalDelete, setModalDelete] = useState({ show: false, id: null });

  const closeModalDelete = () => setModalDelete({ show: false, id: null });

  const handleModalEdit = (data) => {
    setEditData(data);
    setModalEdit(true);
  };

  const handleDelete = async () => {
    const dataId = modalDelete.id;
    const response = await fetch(`${BASE_URL}pegawai/${dataId}`, {
      method: "DELETE",
    });
    const status = await response.status;
    if (status === 200) {
      dispatch(deletePegawai(dataId));
      closeModalDelete();
    }
  };

  const columns = [
    { field: "no", headerName: "No.", width: 50 },
    { field: "id", headerName: "ID", width: 50 },
    { field: "nama", headerName: "Nama", width: 150 },
    { field: "provinsi", headerName: "Provinsi", width: 150 },
    { field: "kabupaten", headerName: "Kabupaten", width: 150 },
    { field: "kecamatan", headerName: "Kecamatan", width: 150 },
    { field: "kelurahan", headerName: "Kelurahan", width: 150 },
    {
      field: "aksi",
      headerName: "Aksi",
      width: 180,
      renderCell: (item) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 5 }}
            onClick={() => handleModalEdit(item.row)}
          >
            <Icon>edit</Icon>
          </Button>
          <Button
            variant="contained"
            size="small"
            style={{ backgroundColor: red[500] }}
            onClick={() => {
              setModalDelete({
                show: true,
                id: item.id,
              });
            }}
          >
            <Icon>delete</Icon>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={data.map((item, idx) => ({ ...item, no: idx + 1 }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />

      {/* MODALS */}
      {modalEdit && (
        <EditModal
          open={modalEdit}
          setOpen={setModalEdit}
          editData={editData}
        />
      )}
      <Dialog
        open={modalDelete.show}
        onClose={closeModalDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Hapus data ini</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah anda yakin ingin menghapus data ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModalDelete}>Batal</Button>
          <Button onClick={handleDelete} sx={{ color: red[500] }}>
            Lanjutkan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RenderData;
