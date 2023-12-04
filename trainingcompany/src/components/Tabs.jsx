import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Customerlist from './Customerlist';
import Traininglist from './Traininglist';


function TabApp() {
  const [value, setValue] = useState('one');

  const handleChange = (event, value) => {
    setValue(value);
  };

  return (
    <div>
      
        <Tabs 
          value={value} 
          onChange={handleChange}
        >
          <Tab value = "one" label="Customer" />
          <Tab value = "two" label="Trainings" />
        </Tabs>

        {value === 'one' && <Customerlist />}
        {value === 'two' && <Traininglist />} 
      
    </div>
  );
}

export default TabApp;
