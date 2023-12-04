import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import dayjs from 'dayjs';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";


function Traininglist() {
  const [training, setTrainings] = useState([]);

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

  const formatDate = dateString => {
    return dayjs(dateString).format('MM/DD/YYYY HH:MM');
  };


  const [columnDefs] = useState([
    { field: 'date', sortable: true, filter:true,  valueFormatter: params => formatDate(params.value) },
    { field: 'duration', sortable: true, filter:true },
    { field: 'activity', sortable: true, filter:true },
    { headerName: 'Customer',
    valueGetter: params => `${params.data.customer.firstname} ${params.data.customer.lastname}`,
    sortable: true, filter:true,}
    
  ]);


  return(
    <>
      
      <div className='ag-theme-material' style={{width: '100%', height: 600}}> 
        <AgGridReact 
          rowData={training}
          columnDefs={columnDefs}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>
     
    </>

  );
}

export default Traininglist;