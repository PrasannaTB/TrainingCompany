import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import _ from 'lodash';

const TrainingChart = () => {
  const [data, setData] = useState([]);
  const [showBarChart, setShowBarChart] = useState(true);

  //const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF33FF']; 
  const COLORS = ['#ff8c00', '#ffa500', '#ffb732', '#ffcc66', '#ffd699'];
  //const COLORS = ['#87CEEB', '#5AC8FA', '#1E90FF', '#007BFF', '#0056b3'];



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://traineeapp.azurewebsites.net/gettrainings');
        
        const groupedData = _.groupBy(response.data, 'activity');
        
        const aggregatedData = _.map(groupedData, (group, activity) => {
          const duration = group.reduce((sum, item) => sum + (item.duration || 0), 0);
        
          return {
            activity,
            duration,
          };
        });
        
        
        setData(aggregatedData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
  }, []);

  const handleToggleChart = () => {
    setShowBarChart(!showBarChart);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
       <div style={{ marginBottom: '20px' }}>
        <button 
          style={{
            padding: '10px',
            fontSize: '15px',
            color: 'black',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleToggleChart}>
          {showBarChart ? 'Show Pie Chart' : 'Show Bar Chart'}
        </button>
      </div>
      {showBarChart ? (
        <BarChart width={600} height={390} data={data}>
          <XAxis dataKey="activity" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="duration" fill="#ff9933" barSize={50}>
            <LabelList dataKey="duration" position="top" />
          </Bar>
          <Legend />
        </BarChart>
       ) : (

        <PieChart width={400} height={400}>
        <Pie data={data} dataKey="duration" nameKey="activity" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
        <Legend />
        </PieChart>
      )}
    </div>
  );
};

export default TrainingChart;
