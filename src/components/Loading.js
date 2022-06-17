import { CircularProgress } from "@mui/material";

export const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 200,
    }}
  >
    <CircularProgress />
  </div>
);
