import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Snackbar, Button } from '@mui/material';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddCustomer from './AddCustomer';

function Customerlist() {
  const gridRef = useRef();
  const [customer, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch(import.meta.env.VITE_API_URL + `/customers`)
      .then(response => {
        if (!response.ok)
          throw new Error("Something went wrong: " + response.statusText);

        return response.json();
      })
      .then(data => {
        setCustomers(data.content);
      })
      .catch(err => console.error(err))
  }

  

  const exportToCSV = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onBtnUpdate = useCallback(() => {
    document.querySelector('#csvResult').value = gridRef.current.api.getDataAsCsv();
  }, []);

  

  return (
    <>
      <AddCustomer fetchCustomers={fetchCustomers} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ margin: '10px 0' }}>
          <Button variant="contained" color="primary" onClick={onBtnUpdate}>
            Show CSV export content text
          </Button>
          <Button variant="contained" color="primary" onClick={exportToCSV}>
            Download CSV export file
          </Button>
        </div>
        <div style={{ flex: '1 1 0', position: 'relative' }}>
          <div className="ag-theme-material">
            <AgGridReact
              ref={gridRef}
              rowData={customer}
              columnDefs={columnDefs}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </div>
          <textarea
            id="csvResult"
            placeholder="Click the Show CSV export content button to view exported CSV here"
          ></textarea>
        </div>
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
