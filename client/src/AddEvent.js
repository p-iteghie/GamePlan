import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import "./Styles/AddEvent.css";

function AddEvent() {
    // Define state for each event field
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [users, setUsers] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
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
        if (loggedInUsername) {  // Only fetch users if loggedInUsername is available
            const fetchUsers = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:5000/get-friends`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    // Filter out the logged-in user from the fetched data

                    setUsers(data); // Set users state with the filtered data
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };

            fetchUsers(); // Call the function to fetch users
        }
    }, [loggedInUsername]);

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page refresh
        const token = localStorage.getItem('token');

        // Make a POST request with event details
        try {
            const response = await fetch('http://localhost:5000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    startTime,
                    endTime,
                    location,
                    userId: loggedInUserId, // Replace with the logged-in user ID
                    attendees,
                }),
            });

            const data = await response.json();
            setResponseMessage(data.message || 'Event added successfully');
        } catch (error) {
            console.error('Error adding event:', error);
            setResponseMessage('Error adding event');
        }
    };

    // Update selected attendees when dropdown value changes
    const handleAttendeeChange = (e) => {
        const userId = e.target.value;
        setAttendees((prevAttendees) => {
            const updatedAttendees = e.target.checked
                ? [...prevAttendees, userId] // Add user ID if checked
                : prevAttendees.filter((id) => id !== userId); // Remove user ID if unchecked
            console.log("Updated attendees:", updatedAttendees); // Log updated attendees to check
            return updatedAttendees;
        });
    };


    return (
        <div style={{ padding: '20px' }}>
            {loggedInUsername && (
                <div className="uppercase-text">
                    <h2>Hi, {loggedInUsername}!</h2> {/* Greet the logged-in user */}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title: </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="description">Description: </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="startTime">Start Time: </label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="endTime">End Time: </label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="location">Location: </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="attendees">
                    <label htmlFor="attendees">Attendees:</label>
                    {users.map((user) => (
                        <div className="attendee" key={user._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={user._id}
                                    onChange={handleAttendeeChange}
                                    checked={attendees.includes(user._id)}
                                />
                                {user.username}
                            </label>
                        </div>
                    ))}
                </div>

                <button type="submit">Add Event</button>

            </form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}

export default AddEvent;