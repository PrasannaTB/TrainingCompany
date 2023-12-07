import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Snackbar } from '@mui/material';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import dayjs from 'dayjs';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";


function Traininglist() {
  const [training, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);


  const fetchTrainings = () => {
    fetch(`https://traineeapp.azurewebsites.net/gettrainings`)
    .then(response => {
      if(!response.ok) 
        throw new Error("Something went wrong: " + response.statusText);
      
      return response.json();
    })
    .then(data => {
        setTrainings(data);
    })
    .catch(err => console.error(err))
  }

  const deleteTraining = (trainingId) => {
    if(window.confirm("Are you sure?")) { 
      const deleteUrl = import.meta.env.VITE_API_URL + `/trainings/${trainingId}`;
      fetch(deleteUrl, { method: 'DELETE'})
      .then(response => {
        if(!response.ok) {
          throw new Error("Error in deletion: " + response.statusText);
        } else {
          setOpen(true);
          fetchTrainings();
        }
          
      })
      .catch(err => console.error(err))
    }
  }


  const formatDate = dateString => {
    return dayjs(dateString).format('DD/MM/YYYY HH:MM');
  };


  const [columnDefs] = useState([
    { field: 'date', sortable: true, filter:true,  valueFormatter: params => formatDate(params.value) },
    { field: 'duration', sortable: true, filter:true },
    { field: 'activity', sortable: true, filter:true },
    { 
      headerName: 'Customer',
    valueGetter: params => `${params.data.customer.firstname} ${params.data.customer.lastname}`,
    sortable: true, filter:true,
    },
    { 
      cellRenderer: params => <Button size="small" onClick={() => deleteTraining(params.data.id)}>
        <DeleteIcon style={{ color: 'red' }} />
      </Button>, 
      width: 120
    },
    
  ]);


  return(
    <>
      <h3 style={{fontFamily : 'highrise'}}>Trainings</h3>
      
      <div className='ag-theme-material' style={{width: '100%', height: 600}}> 
        <AgGridReact 
          rowData={training}
          columnDefs={columnDefs}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>

      <Snackbar 
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Training deleted successfully"
      />
     
    </>

  );
}

export default Traininglist;