import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};

export function UpdateTableModal({ open, handleClose, handleUpdate, table }) {
  const [formData, setFormData] = useState(table);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(formData);
          }}
        >
          <TextField
            margin="normal"
            fullWidth
            name="name"
            label="Table Name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <Button type="submit" color="primary" variant="contained">
            Update Table
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
