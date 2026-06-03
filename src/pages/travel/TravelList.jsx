import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,

} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


const rows = [
  {
    id: 1,
    requestId: "TR-2026-0001",
    purpose: "Client Visit",
    destination: "Bangalore",
    departureDate: "2026-06-01",
    returnDate: "2026-06-03",
    status: "Approved",
  },
];

export default function TravelList() {
  const navigate = useNavigate();

  const columns = [
    { field: "requestId", headerName: "Request ID", flex: 1 },
    { field: "purpose", headerName: "Trip Purpose", flex: 1 },
    { field: "destination", headerName: "Destination", flex: 1 },
    { field: "departureDate", headerName: "Departure", flex: 1 },
    { field: "returnDate", headerName: "Return", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" />
      ),
    },
  ];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">
          Travel Requests
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/travel/create")}
        >
          Create Request
        </Button>
      </Box>

      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10]}
        />
      </Paper>
    </Box>
  );
}