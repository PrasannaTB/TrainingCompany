import {useState} from 'react';
import dayjs from 'dayjs'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

export default function AddTraining({customerdata, fetchTraining}) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: "",
    activity:"",
    duration: "",
    customer: "",
    
  });

  const handleClickOpen = () => {
    setOpen(true);
    setTraining({...training, customer: customerdata.links[0].href})
  };

  const handleClose = () => {
    setOpen(false);
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
    })
    .catch(err => {
      console.error(err);
      alert("Failed to add training. Please try again.");
    })
    
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