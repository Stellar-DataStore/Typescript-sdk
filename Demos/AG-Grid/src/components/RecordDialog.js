import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

const RecordDialog = ({ open, handleClose, record, onChange, onSave }) => {
  return (
    <Dialog open={open} onClose={() => handleClose()} fullWidth maxWidth="sm">
      <DialogTitle>{record.id ? "Update Record" : "Add Record"}</DialogTitle>
      <DialogContent>
        {Object.keys(record).map(
          (key) =>
            key !== "id" && (
              <TextField
                key={key}
                margin="dense"
                label={key}
                type="text"
                fullWidth
                variant="outlined"
                value={record[key]}
                onChange={(e) => onChange(key, e.target.value)}
              />
            )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onSave()} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordDialog;
