import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { TableService }  from "stellards_typescript_sdk";
import config from "../config";
import { UpdateTableModal } from "./modals/UpdateTableModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateTableModal from "./modals/CreateTableModal";

export default function TablesList() {
  const [tables, setTables] = useState<{ id: string; name: string; description?: string }[]>([]);
  const navigate = useNavigate();
  const [currentTable, setCurrentTable] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const tableService = new TableService(config.authToken?? "", config.projectId ?? "");

  async function fetchTables() {
    const response = await tableService.getTables(config.projectId ?? "");
    setTables(response.data);
  }

  useEffect(() => {
    if (config.projectId) {
      fetchTables();
    }
  }, [config.projectId]);

  const handleDeleteTable = async (tableId: string) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      await tableService.deleteTable(config.projectId ?? "", tableId);
      fetchTables(); // Refresh the list after deletion
    }
  };

  const handleUpdateTable = async (tableData: any) => {
    await tableService.updateTable(config.projectId?? "", tableData.id, tableData);
    setModalOpen(false);
    setCurrentTable(null);
    fetchTables(); // Refresh the list after update
  };

  const handleCreateNewTable = async (tableData: any) => {
    await tableService.createTable(config.projectId?? "", tableData);
    fetchTables();
    setCreateModalOpen(false);
  };

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ m: 2 }}>
        Tables
      </Typography>
      <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
        Create New Table
      </Button>
      <CreateTableModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNewTable}
      />
      <Grid container spacing={3}>
        {tables.map((table) => (
          <>
            <Grid item xs={12} sm={6} md={4} key={table.id}>
              <Card>
                <CardContent
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() =>
                    navigate(`/table/${table.id}`)
                  }
                >
                  <Typography variant="h5">{table.name}</Typography>
                  <Typography variant="body2">
                    {table.description || "No description available"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box style={{ float: "right" }}>
                    <IconButton
                      style={{ color: "black" }}
                      onClick={() => {
                        setCurrentTable(table);
                        setModalOpen(true);
                      }}
                      aria-label="edit"
                      size="small"
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      style={{ color: "black" }}
                      onClick={() => handleDeleteTable(table.id)}
                      aria-label="delete"
                      size="small"
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          </>
        ))}
      </Grid>
      {currentTable && (
        <UpdateTableModal
          open={modalOpen}
          handleClose={() => {
            setModalOpen(false);
          }}
          handleUpdate={handleUpdateTable}
          table={currentTable}
        />
      )}
    </>
  );
}
