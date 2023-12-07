import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const MyCalendarWithFetch = () => {
  const [trainingEvents, setTrainingEvents] = useState([]);

  useEffect(() => {
    fetchTrainingData();
  }, []);
 
  

  const fetchTrainingData = async () => {
    try {
      const response = await fetch('https://traineeapp.azurewebsites.net/gettrainings');
      const data = await response.json();
  
      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error('Error: The API response is not an array.');
        return;
      }
  
      const formattedEvents = data.map(training => ({
        start: new Date(training.date),
        end: moment(training.date).add(training.duration, 'minutes').toDate(),
        title:`${training.activity} - ${training.customer.firstname}  ${training.customer.lastname}`,
  
      }));
  
      
      console.log('Formatted events:', formattedEvents);
  
      setTrainingEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching training data:', error);
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#3174AD', // Set your preferred background color
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white',
      textAlign: 'left', // Align text to the left
    };
  
    return {
      style,
    };
  };
  


  return (
    <div>
      <Calendar
        localizer={localizer}
        events={trainingEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        
      />
    </div>
  );
};

export default MyCalendarWithFetch;
