import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventText, setEventText] = useState('');
  const [events, setEvents] = useState({});

useEffect(()=>{
    const storedEvents = localStorage.getItem('events');
    if(storedEvents){
      setEvents(JSON.parse(storedEvents));
    }
  }, [])

  useEffect(()=>{
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleEventTextChange = (e) => {
    setEventText(e.target.value);
  };

  const handleAddEvent = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today){
            alert('Cannot add events to past dates.');
            return;
        }
        if (!selectedDate || !eventText) {
            alert('Please select a date and enter an event description.');
            return;
        }

    const dateString = selectedDate.toDateString();
    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };
      if (newEvents[dateString]) {
        newEvents[dateString].push(eventText);
      } else {
        newEvents[dateString] = [eventText];
      }
      return newEvents;
    });

    setEventText('');
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      const zeroHourtoday = new Date()
      zeroHourtoday.setHours(0, 0, 0, 0);
      if (events[dateString]) {
        return 'highlight';
      }
      else if(date < zeroHourtoday){
        return 'disabled';
      }
    }
    return null;
  };

  return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-6 bg-info rounded-3">
                <h1 className="mb-4 text-center">Event Calendar</h1>
                <div className="p-3">
                    <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={tileClassName}
                    />
                    <input
                    type="text"
                    className="form-control my-3"
                    value={eventText}
                    onChange={handleEventTextChange}
                    placeholder="Enter event description"
                    />
                    <button
                    className="btn btn-primary mb-3 w-100"
                    onClick={handleAddEvent}
                    >
                    Add Event
                    </button>
                </div>
            </div>
            <div className="col-md-5 offset-1 bg-info-subtle rounded-3">
            {
                Object.keys(events).filter((date) => date === selectedDate.toDateString()).length > 0 ?
                Object.keys(events).filter((date) => date === selectedDate.toDateString())
                .map((date) => (
                    <div key={date} className="my-3">
                        <h3 className="my-3 text-center">Events</h3>
                        <ul className="list-group">
                            {events[date].map((event, index) => (
                            <li key={index} className="list-group-item mb-1">{event}</li>
                            ))}
                        </ul>
                    </div>
                )) :
                <div className="my-3 text-center fs-3">No events added</div>
            }
            </div>
        </div>
    </div>
  );
};

export default EventCalendar;
