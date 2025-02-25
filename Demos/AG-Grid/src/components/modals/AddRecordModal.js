import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

const AddRecordModal = ({ isOpen, onClose, onAdd, columns }) => {
  const [recordData, setRecordData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Reset form when modal opens or columns change
  useEffect(() => {
    const initialData = columns.reduce((acc, column) => {
      acc[column.field] = ""; // Initialize all fields with an empty string
      return acc;
    }, {});
    setRecordData(initialData);
    setIsFormValid(false); // Reset form validity when columns or modal open state changes
  }, [columns, isOpen]);

  const handleChange = (field, value) => {
    const updatedData = { ...recordData, [field]: value };
    setRecordData(updatedData);
    validateForm(updatedData);
  };

  const validateForm = (data) => {
    // Check if all fields in the data object are non-empty
    const allFieldsFilled = columns.every(
      (column) => data[column.field].trim() !== ""
    );
    setIsFormValid(allFieldsFilled);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      onAdd(recordData);
      onClose(); // Close the modal after adding
    } else {
      alert("Please fill in all fields.");
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add New Record</DialogTitle>
      <DialogContent>
        {columns.map((column) => (
          <TextField
            key={column.field}
            label={column.headerName}
            value={recordData[column.field] || ""}
            onChange={(e) => handleChange(column.field, e.target.value)}
            margin="dense"
            fullWidth
            required
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecordModal;
