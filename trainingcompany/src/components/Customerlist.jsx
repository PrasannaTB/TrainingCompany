import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Snackbar } from '@mui/material';
import { Button } from '@mui/material';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';


function Customerlist() {
  const [customer, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch(import.meta.env.VITE_API_URL + `/customers`)
    .then(response => {
      if(!response.ok) 
        throw new Error("Something went wrong: " + response.statusText);
      
      return response.json();
    })
    .then(data => {
      setCustomers(data.content);
    })
    .catch(err => console.error(err))
  }

  const fetchTrainings = () => {
    fetch(import.meta.env.VITE_API_URL + `/trainings`)
      .then((response) => {
        if (!response.ok) throw new Error('Error fetching trainings: ' + response.statusText);
        return response.json();
      })
      .then((data) => {
        setTrainings(data);
      })
      .catch((err) => console.error(err));
  };

  const deleteCustomer = (url) => {
    if(window.confirm("Are you sure?")) { 
      fetch(url, { method: 'DELETE'})
      .then(response => {
        if(!response.ok) {
          throw new Error("Error in deletion: " + response.statusText);
        } else {
          setOpen(true);
          fetchCustomers();
        }
          
      })
      .catch(err => console.error(err))
    }
  }



  const [columnDefs] = useState([
    { field: 'firstname', sortable: true, filter:true },
    { field: 'lastname', sortable: true, filter:true },
    { field: 'streetaddress', sortable: true, filter:true },
    { field: 'postcode', sortable: true, filter:true, width: 120 },
    { field: 'city', sortable: true, filter:true, width: 130 },
    { field: 'email', sortable: true, filter:true },
    { field: 'phone', sortable: true, filter:true },
    
    {
      cellRenderer: params => <EditCustomer customerdata={params.data} fetchCustomers={fetchCustomers} />,
      width: 120
    },
    { 
      cellRenderer: params => <Button size="small" onClick={() => deleteCustomer(params.data.links[0].href)}>Delete</Button>, 
      width: 120
    },
  ]);


  return(
    <>
      <AddCustomer fetchCustomers = {fetchCustomers}/>
      <div className='ag-theme-material' style={{width: '100%', height: 600}}> 
        <AgGridReact 
          rowData={customer}
          columnDefs={columnDefs}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>

      <Snackbar 
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Customer deleted successfully"
      />
     
    </>

  );
}

export default Customerlist;