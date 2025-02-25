import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  border: "1px solid #0B506D",
  background: "white",
  backdropFilter: "blur(20px)",
  color: "white",
};
export const AddFieldModal = ({
  isOpen,
  onClose,
  fieldData,
  setFieldData,
  handleAddField,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFieldData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <form onSubmit={handleAddField}>
          <TextField
            id="name"
            name="name"
            label="Field Name"
            value={fieldData.name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ mb: 2 }} // margin-bottom for spacing
          />
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel id="type-label">Field Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={fieldData.type}
              onChange={handleInputChange}
              label="Field Type"
            >
              <MenuItem value="Int">Int</MenuItem>
              <MenuItem value="Float">Float</MenuItem>
              <MenuItem value="NVarChar(255)">NVarChar(255)</MenuItem>
              <MenuItem value="Real">Real</MenuItem>
              <MenuItem value="SmallInt">SmallInt</MenuItem>
              <MenuItem value="TinyInt">TinyInt</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Field
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
