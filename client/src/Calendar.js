import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import "./Styles/Calendar.css"; // Create a simple CSS file for styling.

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState('');
    const [loggedInUsername, setLoggedInUsername] = useState('');

    // Fetch available users when component loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('Decoded token:', decoded);
                // Assuming the token has a username, store the username in the state
                setLoggedInUserId(decoded._id);  // or decoded.userId, depending on what you store in the token
                setLoggedInUsername(decoded.username);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

  useEffect(() => {
    // Fetch events from the server when the component mounts.
      const fetchEvents = async () => {
          const token = localStorage.getItem('token');
          if (loggedInUsername) {
              try {
                  const response = await fetch('http://localhost:5000/getevents', {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                      },
                  }); // Ensure your server endpoint is correct.
                  const data = await response.json();
                  setEvents(data);
              } catch (error) {
                  console.error("Error fetching events:", error);
              }
          }
      
    };

    fetchEvents();
  }, [loggedInUsername]);

  useEffect(() => {
    // Filter events based on the current month and year.
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const eventsInMonth = events.filter(event => {
          const eventStartTime = new Date(event.startTime);
          const eventEndTime = new Date(event.endTime); // For multi-day events
          return (
              (eventStartTime >= startOfMonth && eventStartTime <= endOfMonth) || // Starts in the month
              (eventEndTime >= startOfMonth && eventEndTime <= endOfMonth) || // Ends in the month
              (eventStartTime <= startOfMonth && eventEndTime >= endOfMonth) // Spans entire month
          );
      });

    setFilteredEvents(eventsInMonth);
  }, [currentDate, events]);

  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  return (
    <div className="Calendar">
          <h1>GamePlan Calendar</h1>
          <div>
              
              <h3>Event Data:</h3>
              <pre>{JSON.stringify(events, null, 2)}</pre>
          </div>
          <div>
              <h3>Filtered Event Data:</h3>
              <pre>{JSON.stringify(filteredEvents, null, 2)}</pre>
          </div>
      <div className="calendar-container">
        <header>
          <button onClick={() => changeMonth(-1)}>Previous</button>
          <h2>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => changeMonth(1)}>Next</button>
        </header>
        <div className="calendar-grid">
          {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1; // Calendar days start from 1
          const dayEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.startTime); // Ensure this matches your schema
            return (
              eventDate.getDate() === day &&
              eventDate.getMonth() === currentDate.getMonth() &&
              eventDate.getFullYear() === currentDate.getFullYear()
            );
          });

            return (
              <div className="calendar-day" key={day}>
                <div className="date">{day}</div>
                <div className="events">
                  {dayEvents.map((event, index) => (
                    <div className="event" key={index}>
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
