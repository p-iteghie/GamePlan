import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Treat invalid tokens as expired
    }
};

const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decoded.exp > currentTime; // Token is valid if current time is before the expiration
    } catch (error) {
        console.error("Invalid token:", error);
        return false;
    }
};

const ProtectedRoute = ({ children }) => {
    return isTokenValid() ? children : <Navigate to="/" />;
};

function TokenManager() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (token) {
                const isExpired = isTokenExpired(token);
                if (isExpired) {
                    console.log("Token expired. Logging out.");
                    localStorage.removeItem("token"); // Remove expired token
                    navigate("/"); // Redirect to login page
                }
            }
        };

        // Check token immediately
        checkToken();

        // Periodically check token every minute
        const interval = setInterval(checkToken, 60000); // 60 seconds

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, [navigate]);

    return null; // This component doesn't render anything
}

export { TokenManager, ProtectedRoute };