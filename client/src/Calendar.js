import React, { useState, useEffect } from "react";
import "./Styles/Calendar.css"; // Create a simple CSS file for styling.

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the server when the component mounts.
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events"); // Ensure your server endpoint is correct.
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on the current month and year.
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const eventsInMonth = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfMonth && eventDate <= endOfMonth;
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
            const day = i + 1;
            const dayEvents = filteredEvents.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getDate() === day;
            });

            return (
              <div className="calendar-day" key={day}>
                <div className="date">{day}</div>
                <div className="events">
                  {dayEvents.map((event, index) => (
                    <div className="event" key={index}>
                      {event.name}
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
