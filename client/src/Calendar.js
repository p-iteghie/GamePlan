import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import "./Styles/Calendar.css";

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState('');
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [showRawData, setShowRawData] = useState(false); // State to toggle raw data display

    // Fetch available users when component loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setLoggedInUserId(decoded._id);
                setLoggedInUsername(decoded.username);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    useEffect(() => {
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
                    });
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
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const eventsInMonth = events.filter(event => {
            const eventStartTime = new Date(event.startTime);
            const eventEndTime = new Date(event.endTime);
            return (
                (eventStartTime >= startOfMonth && eventStartTime <= endOfMonth) ||
                (eventEndTime >= startOfMonth && eventEndTime <= endOfMonth) ||
                (eventStartTime <= startOfMonth && eventEndTime >= endOfMonth)
            );
        });

        setFilteredEvents(eventsInMonth);
    }, [currentDate, events]);

    const changeMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const getColorByObjectId = (objectId) => {
        const charSum = objectId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const hue = charSum * 1.83 % 360;
        return `hsl(${hue}, 80%, 65%)`;
    };

    const getHoverColorByObjectId = (objectId) => {
        const charSum = objectId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const hue = charSum * 1.83 % 360;
        return `hsl(${hue}, 50%, 55%)`;
    };

    return (
        <div className="Calendar">
            <h1>GamePlan Calendar</h1>

            {/* Calendar UI */}
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
                        const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

                        const dayEvents = filteredEvents.filter(event => {
                            const eventStartTime = new Date(event.startTime);
                            const eventEndTime = new Date(event.endTime);
                            return (
                                (eventStartTime <= currentDayDate && eventEndTime >= currentDayDate) ||
                                (eventStartTime < currentDayDate && eventEndTime >= currentDayDate) ||
                                (eventStartTime.getDate() === currentDayDate.getDate() && eventStartTime.getMonth() === currentDayDate.getMonth())
                            );
                        });

                        return (
                            <div className="calendar-day" key={day}>
                                <div className="date">{day}</div>
                                <div className="events">
                                    {dayEvents.map((event, index) => (
                                        <div
                                            className="event"
                                            key={index}
                                            style={{
                                                backgroundColor: getColorByObjectId(event._id),
                                                transition: "background-color 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getHoverColorByObjectId(event._id)}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = getColorByObjectId(event._id)}
                                        >
                                            {event.title || "No Title"}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Toggle raw data button */}
            <button className="button-raw-data" onClick={() => setShowRawData(!showRawData)}>
                {showRawData ? "Hide Raw Data" : "Show Raw Data"}
            </button>

            {showRawData && (
                <div>
                    <h3>Event Data (Raw):</h3>
                    <pre>{JSON.stringify(events, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Calendar;
