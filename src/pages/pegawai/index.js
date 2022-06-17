import {
  Box,
  Button,
  Container,
  Divider,
  Icon,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Loading } from "../../components";
import CreateModal from "./Create";
import RenderData from "./RenderData";

const Pegawai = () => {
  const [modalCreate, setModalCreate] = useState(false);
  const { data, loading, error } = useSelector((state) => state.pegawai);

  const openCreateModal = () => setModalCreate(true);

  return (
    <Container maxWidth="lg">
      <CreateModal open={modalCreate} setOpen={setModalCreate} />

      <Box m={2} p={2} sx={{ boxShadow: "0 0 8px rgba(0,0,0,0.2) " }}>
        <Typography mb={3} variant="h4" component="h1">
          Data Pegawai
        </Typography>

        <Button
          startIcon={<Icon>add</Icon>}
          variant="contained"
          color="primary"
          onClick={openCreateModal}
          sx={{ mr: 2 }}
        >
          Tambah Pegawai
        </Button>

        <Divider sx={{ my: 3 }} />

        {loading && <Loading />}

        {!loading && !error && <RenderData data={data.pegawai} />}
      </Box>
    </Container>
  );
};

export default Pegawai;
