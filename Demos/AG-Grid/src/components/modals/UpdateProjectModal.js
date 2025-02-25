import React from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

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
  background: "white",
  color: "black", // Ensure text is readable
};

export const UpdateProjectModal = ({
  isOpen,
  onClose,
  projectDetails,
  setProjectDetails,
  handleUpdateProject,
}) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <form onSubmit={handleUpdateProject}>
          <TextField
            name="name"
            label="Project Name"
            value={projectDetails.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            name="description" // Corrected the name attribute to be lowercase
            label="Description"
            value={projectDetails.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
