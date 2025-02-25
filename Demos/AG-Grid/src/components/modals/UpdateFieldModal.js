import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
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
export const UpdateFieldModal = ({
  isOpen,
  onClose,
  fieldDetails,
  setFieldDetails,
  handleUpdateField,
}) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFieldDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <form onSubmit={handleUpdateField}>
          <TextField
            name="name"
            label="Field Name"
            value={fieldDetails.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="type-label">Field Type</InputLabel>
            <Select
              labelId="type-label"
              name="type"
              value={fieldDetails.type}
              onChange={handleInputChange}
              label="Field Type"
              required
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
            Update Field
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
