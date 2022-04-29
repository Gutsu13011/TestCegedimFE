import { useState } from 'react';
import {
  Dialog,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

const DialogDelete = ({ patientName, appointmentId, deleteAppointment }) => {
  const [open, setOpen] = useState(false);
  const handleClick = (value) => {
    setOpen(value);
  };
  const onDelete = () => {
    deleteAppointment(appointmentId);
    handleClick(false);
  };

  return (
    <>
      <Button style={{ color: 'red' }} onClick={() => handleClick(true)}>
        DELETE
      </Button>
      <Dialog open={open}>
        <DialogTitle>
          <Typography>{`Delete ${patientName}'s appointment`} </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this appointment ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleClick(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onDelete}>
            Sure
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogDelete;
