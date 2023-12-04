import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";


function Customerlist() {
  const [customer, setCustomers] = useState([]);

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


  const [columnDefs] = useState([
    { field: 'firstname', sortable: true, filter:true },
    { field: 'lastname', sortable: true, filter:true },
    { field: 'streetaddress', sortable: true, filter:true },
    { field: 'postcode', sortable: true, filter:true, width: 120 },
    { field: 'city', sortable: true, filter:true, width: 130 },
    { field: 'email', sortable: true, filter:true },
    { field: 'phone', sortable: true, filter:true },
    
  ]);


  return(
    <>
     
      <div className='ag-theme-material' style={{width: '100%', height: 600}}> 
        <AgGridReact 
          rowData={customer}
          columnDefs={columnDefs}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>
     
    </>

  );
}

export default Customerlist;