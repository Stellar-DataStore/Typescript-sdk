import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TableService }  from "stellards_typescript_sdk";
import { AgGridReact } from "ag-grid-react";
import config from "../config";
import { UpdateFieldModal } from "./modals/UpdateFieldModal";
import { AddFieldModal } from "./modals/AddFieldModal";
import { Button, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddRecordModal from "./modals/AddRecordModal"; // Ensure the path is correct
import SaveAsIcon from "@mui/icons-material/SaveAs";

interface FieldData {
  id: number;
  name: string;
  type: string;
}

const CustomHeader = ({ data, onUpdate, onDelete }: { data: FieldData; onUpdate: (data: FieldData) => void; onDelete: (id: number) => void }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ marginRight: "60px" }}>{data.name}</span>
      <Box
        style={{
          float: "right",
        }}
      >
        {data.id !== -1 && (
          <IconButton
            style={{ color: "black" }}
            onClick={() => onUpdate(data)}
            aria-label="edit"
            size="small"
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        )}
        {data.id !== -1 && (
          <IconButton
            style={{ color: "black" }}
            onClick={() => onDelete(data.id)}
            aria-label="delete"
            size="small"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
    </div>
  );
};

const TableComponent = () => {
  const { tableId } = useParams();
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [fieldData, setFieldData] = useState({ name: "", type: "" });
  const [isUpdateFieldModalOpen, setIsUpdateFieldModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  const [fieldDetails, setFieldDetails] = useState({
    id: 0,
    name: "",
    type: "",
  });

  const openAddFieldModal = () => setIsAddFieldModalOpen(true);
  const closeAddFieldModal = () => setIsAddFieldModalOpen(false);
  const openUpdateFieldModal = () => setIsUpdateFieldModalOpen(true);
  const closeUpdateFieldModal = () => setIsUpdateFieldModalOpen(false);
  const openAddRecordModal = () => setIsAddRecordModalOpen(true);
  const closeAddRecordModal = () => setIsAddRecordModalOpen(false);

  const tableService = useMemo(() => {
    return new TableService(config.authToken ?? "", config.projectId ?? "");
  }, []);

  const fetchTableData = useCallback(async () => {
    try {
      const response = await tableService.getTableData(config.projectId ?? "", Number(tableId));
      setRowData(response.data); // Adjust based on your API response
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  }, [config.projectId, tableId, tableService]);

  const fetchTableFields = async () => {
    try {
      const fields = await tableService.getTableFields(config.projectId ?? "", Number(tableId));

      const columns = fields.map((field: any) => ({
        headerName: field.name,
        field: field.name,
        editable: true,
        cellEditor: "agTextCellEditor", // Default text editor
        headerComponent: CustomHeader,
        headerComponentParams: {
          data: field,
          onUpdate: handleUpdateFieldClick,
          onDelete: handleDeleteField,
        },
      }));
      columns.push({
        headerName: "Actions",
        cellRenderer: ActionButtons,
        cellRendererParams: {
          onUpdate: handleUpdateRecordPrompt,
          onDelete: handleDeleteRecord,
        },
      });

      setColumnDefs(columns);
    } catch (error) {
      console.error("Error fetching table fields:", error);
    }
  };
  useEffect(() => {
    fetchTableFields();
    fetchTableData();
  }, []);

  const handleAddRecord = async (newRecord: any) => {
    try {
      const updatedRowData = [
        ...rowData,
        { ...newRecord, id: rowData.length + 1 },
      ]; // Assuming 'id' is managed manually
      await tableService.addRecords(config.projectId??"", tableId ?? "", [newRecord]);
      setRowData(updatedRowData);
      alert("Record added successfully");
      fetchTableData();
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Failed to add record. Please check the console for more details.");
    }
  };
  const handleUpdateRecordPrompt = async (currentData: any) => {
    const updatedDataString = prompt(
      "Update record data in JSON format:",
      JSON.stringify(currentData)
    );
    if (updatedDataString) {
      const updatedData = JSON.parse(updatedDataString);
      // Assuming `currentData` includes an `id` field
      const idList = [currentData.id]; // Extract the ID into an array
      const record = {
        Name: updatedData.Name,
        Email: updatedData.Email,
      };
      await tableService.updateRecords(config.projectId ?? "", Number(tableId), idList, [record]);

      fetchTableData();
    }
  };

  const handleDeleteRecord = async (recordId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmDelete) {
      await tableService.deleteRecords(config.projectId ?? "", Number(tableId), recordId);
      fetchTableData();
    }
  };

  const handleDeleteAllRecord = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all records?"
    );
    if (confirmDelete) {
      await tableService.clearTable(config.projectId?? "", Number(tableId));
      fetchTableData();
    }
  };

  const toggleEdit = (data: any) => {
    console.log("Toggling edit state for:", data.id);
    if (editingRowId === data.id) {
      setEditingRowId(null); // Correctly resets on toggle if already editing
    } else {
      setEditingRowId(data.id); // Sets new ID to edit
    }
  };

  const saveChanges = async (data: any) => {
    console.log("Saving changes for:", data.id);
    try {
      const idList = [data.id];
      await tableService.updateRecords(config.projectId?? "", Number(tableId), idList, data);
      setEditingRowId(null); // Clear editing state on successful save
      alert("Record updated successfully");
      fetchTableData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to save changes, please try again.");
    }
  };
  const ActionButtons = ({ data }: { data: any }) => {
    return (
      <Box style={{ float: "right" }}>
        <IconButton
          style={{ color: "grey" }}
          onClick={() => toggleEdit(data)}
          aria-label="edit"
          size="small"
        >
          <EditIcon fontSize="inherit" />
        </IconButton>

        <IconButton
          style={{ color: "green" }}
          onClick={() => saveChanges(data)}
          aria-label="save"
          size="small"
        >
          <SaveAsIcon />
        </IconButton>

        <IconButton
          style={{ color: "black" }}
          onClick={() => handleDeleteRecord(data.id)}
          aria-label="delete"
          size="small"
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Box>
    );
  };

  const handleAddField = async (e: any) => {
    e.preventDefault();

    try {
      await tableService.addField(config.projectId?? "", Number(tableId), fieldData);
      fetchTableData();
      fetchTableFields();
      closeAddFieldModal();
      alert("Field added successfully!");
      setFieldData({ name: "", type: "" }); // Reset form
    } catch (error) {
      alert("Failed to add field. See console for details.");
      console.error(error);
    }
  };

  const handleUpdateFieldClick = (record: any) => {
    setFieldDetails(record); // Track the field to update
    openUpdateFieldModal();
  };

  const handleUpdateField = async (event: any) => {
    event.preventDefault();
    try {
      const fieldId = fieldDetails.id;
      await tableService.updateField(config.projectId?? "", Number(tableId), fieldDetails, fieldId);
      fetchTableFields();
      setFieldDetails({ id: 0, name: "", type: "" });
      alert("Field updated successfully!");
      closeUpdateFieldModal();
    } catch (error) {
      alert("Failed to update field. See console for details.");
      console.error(error);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this field?"
    );
    if (confirmDelete) {
      await tableService.deleteField(config.projectId?? "", Number(tableId), fieldId);
      fetchTableFields();
    }
  };
  const getRowStyle = (params: any) => {
    if (params.node.data.id === editingRowId) {
      return { backgroundColor: "orange", color: "white" }; // Change as per your theme
    } else {
      return { backgroundColor: "", color: "" };
    }
  };
  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <div>
        <AddRecordModal
          isOpen={isAddRecordModalOpen}
          onClose={closeAddRecordModal}
          onAdd={handleAddRecord}
          columns={columnDefs.filter(
            (column: any) => column.headerName !== "Actions" && column.field !== "id"
          )}
        />
        <UpdateFieldModal
          isOpen={isUpdateFieldModalOpen}
          onClose={closeUpdateFieldModal}
          fieldDetails={fieldDetails}
          setFieldDetails={setFieldDetails}
          handleUpdateField={handleUpdateField}
        />
        <AddFieldModal
          isOpen={isAddFieldModalOpen}
          onClose={closeAddFieldModal}
          fieldData={fieldData}
          setFieldData={setFieldData}
          handleAddField={handleAddField}
        />
      </div>
      <Button
        style={{ marginRight: "5px" }}
        variant="contained"
        onClick={openAddFieldModal}
      >
        Add Field
      </Button>
      <Button variant="contained" onClick={openAddRecordModal}>
        Add Record
      </Button>

      <Button
        style={{ float: "right" }}
        variant="outlined"
        color="error"
        onClick={handleDeleteAllRecord}
      >
        Clear All Records
      </Button>
      <div style={{ width: "100%", height: "100vh" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          getRowStyle={getRowStyle}
          onCellValueChanged={(event) => {
            if (editingRowId === event.data.id) {
              saveChanges(event.data);
            }
          }}
        />
      </div>
    </div>
  );
};

export default TableComponent;
