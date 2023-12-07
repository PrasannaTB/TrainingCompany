import {useState} from 'react';
import dayjs from 'dayjs'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

export default function AddTraining({fetchTraining}) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: "",
    activity:"",
    duration: "",
    customer: "",
    
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchCustomerId = async (customerName) => {
    try {
      const response = await fetch(
        `https://traineeapp.azurewebsites.net/customers?firstname=${customerName}`
      );
      const customerData = await response.json();

      if (customerData && customerData.length > 0) {
        return customerData[0].id;
      } else {
        throw new Error("Customer not found");
      }
    } catch (error) {
      console.error("Error fetching customer ID:", error);
      throw error;
    }
  };

  const handleSave = () => {
    const isoDate = dayjs(training.date).toISOString();
    const formattedTraining = { ...training, date: isoDate };

    fetch(import.meta.env.VITE_API_URL + '/trainings', {
        method: 'POST', 
        headers: {'Content-type':'application/json'},
        body: JSON.stringify(formattedTraining)
    })
    .then(response => {
        if(!response.ok)
            throw new Error("Addition failed: " + response.statusText);
        fetchTraining();

    })
    .catch(err => console.error(err))
    
    handleClose();
  }

  return (
    <>
      <Button size='small' onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Training</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            type="datetime-local"
            value={training.date}
            onChange={e => setTraining({...training, date: e.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Activity"
            value={training.activity}
            onChange={e => setTraining({...training, activity: e.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Duration"
            value={training.duration}
            onChange={e => setTraining({...training, duration: e.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Customer"
            value={training.customer}
            onChange={e => setTraining({...training, customer: e.target.value})}
            fullWidth
            variant="standard"
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}