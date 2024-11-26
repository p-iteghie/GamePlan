import React, { useState } from 'react';

const SendFriendRequest = () => {
    const [username, setUsername] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');  // Get token from localStorage

        try {
            const response = await fetch('http://localhost:5000/send-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();
            setResponseMessage(data.message || 'Friend request sent successfully');
        } catch (error) {
            console.error('Error sending friend request:', error);
            setResponseMessage('Error sending friend request!');
        }
    };



    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
                <button type="submit">Send Friend Request</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default SendFriendRequest;
