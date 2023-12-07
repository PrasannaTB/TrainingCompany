import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Snackbar, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import AddTraining from './AddTraining';

function Customerlist() {
  const [customer, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const gridRef = useRef();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch(import.meta.env.VITE_API_URL + `/customers`)
      .then((response) => {
        if (!response.ok) throw new Error('Something went wrong: ' + response.statusText);

        return response.json();
      })
      .then((data) => {
        setCustomers(data.content);
      })
      .catch((err) => console.error(err));
  };

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
    if (window.confirm('Are you sure?')) {
      fetch(url, { method: 'DELETE' })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error in deletion: ' + response.statusText);
          } else {
            setOpen(true);
            fetchCustomers();
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const [columnDefs] = useState([
    { field: 'firstname', sortable: true, filter: true },
    { field: 'lastname', sortable: true, filter: true },
    { field: 'streetaddress', sortable: true, filter: true },
    { field: 'postcode', sortable: true, filter: true, width: 120 },
    { field: 'city', sortable: true, filter: true, width: 130 },
    { field: 'email', sortable: true, filter: true },
    { field: 'phone', sortable: true, filter: true },
    {
      cellRenderer: (params) => <AddTraining customerdata={params.data} fetchCustomers={fetchCustomers} />,
      width: 120,
      colId: 'addTraining', 
      suppressMenu: true,
    },
    {
      cellRenderer: (params) => <EditCustomer customerdata={params.data} fetchCustomers={fetchCustomers} />,
      width: 120,
      colId: 'editColumn', 
      suppressMenu: true,
    },
    {
      cellRenderer: (params) => (
        <Button size='small' onClick={() => deleteCustomer(params.data.links[0].href)}>
          <DeleteIcon style={{ color: 'red' }} />
        </Button>
      ),
      width: 120,
      colId: 'deleteColumn', 
      suppressMenu: true,
    },
  ]);

  return (
    <>
      <h3 style={{fontFamily : 'highrise'}}>CUSTOMERS</h3>
      <AddCustomer fetchCustomers={fetchCustomers} />
      <div className='ag-theme-material' style={{ width: '100%', height: 600 }}>
        <AgGridReact
          ref={gridRef}
          rowData={customer}
          columnDefs={columnDefs}
          pagination={true}
          paginationAutoPageSize={true}
          skipHeader={true} // Exclude headers from export
          skipFooters={true}
          /*
          processCellCallback={(params) => {
            // Exclude "Edit" and "Delete" columns from export
            if (params.column.colId === 'editColumn' || params.column.colId === 'deleteColumn') {
              return null;
            }
            return params.value;
          }}*/

        />

        <div style={{ position: 'absolute', top: '80px', right: '20px' }}>
          <button 
            style={{
              padding: '8px',
              fontSize: '15px',
              color: 'black',
              border: 'black',
              cursor: 'pointer',
            }}
            onClick={onBtnExport}>Export file</button>
        </div>
        

      </div>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} message='Customer deleted successfully' />
    </>
  );
}

export default Customerlist;