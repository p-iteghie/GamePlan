import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem('token');

        // Update the login state (if using a context or state)
        if (setIsLoggedIn) {
            setIsLoggedIn(false);
        }

        // Redirect to the login or home page
        navigate('/'); // Change '/login' to the desired route
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;