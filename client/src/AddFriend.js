import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

function FriendRequests() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
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
        const fetchFriendRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/get-friend-requests`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setFriendRequests(data);
            } catch (error) {
                setError("Failed to load friend requests.");
            }
        };

        fetchFriendRequests();
    }, [loggedInUsername]);

    useEffect(() => {
        const fetchFriends = async () => {
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
                setFriends(data);
            } catch (error) {
                setError("Failed to load friends.");
            }
        };

        fetchFriends();
    }, [loggedInUsername]);

    const handleAccept = async (requesterId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:5000/accept-friend-request", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: loggedInUsername,
                    requesterId: requesterId,
                }),
            });

            if (response.ok) {
                setFriendRequests(friendRequests.filter((req) => req._id !== requesterId));
            }
        } catch (error) {
            setError("Error accepting friend request.");
        }
    };

    const handleDeny = async (requesterId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:5000/deny-friend-request", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: loggedInUsername,
                    requesterId: requesterId,
                }),
            });

            if (response.ok) {
                setFriendRequests(friendRequests.filter((req) => req._id !== requesterId));
            }
        } catch (error) {
            setError("Error denying friend request.");
        }
    };

    return (
        <div>
            <h1>Your Friends</h1>
            <div>
                
                {friends.length === 0 ? (
                    <p>You have no friends yet.</p>
                ) : (
                    friends.map((friend) => (
                        <div key={friend._id}>
                            <p>{friend.username}</p>
                        </div>
                    ))
                )}
            </div>
            <h1>Friend Requests</h1>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div>
                
            </div>
            
            <div>
                {friendRequests.length === 0 ? (
                    <p>No friend requests.</p>
                ) : (
                    friendRequests.map((request) => (
                        <div key={request._id}>
                            <p>{request.username} wants to be your friend!</p>
                            <button onClick={() => handleAccept(request._id)}>Accept</button>
                            <button onClick={() => handleDeny(request._id)}>Deny</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FriendRequests;