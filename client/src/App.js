import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Visuals from './Visuals';
import Register from './Register';
import AddEvent from './AddEvent';
import FriendRequests from './AddFriend';
import { TokenManager, ProtectedRoute } from './TokenManager'
import Calendar from './Calendar';
import { Login, GetUserButton } from './Login';
import SendFriendRequest from './Friends';
import LogoutButton from './Logout';


function App() {
    return (
        <div>
            <TokenManager />
            <nav className="navbar">
                <Link to="/" className="nav-link">Home | </Link>
                <Link to="/friends" className="nav-link">Friends | </Link>
                <Link to="/login" className="nav-link">Login | </Link>
                <Link to="/getuser" className="nav-link">Get User | </Link>
                <Link to="/events" className="nav-link">Add Event | </Link>
                <Link to="/calendar" className="nav-link">Calendar</Link>
            </nav>
            <Routes>
                <Route path="/" element={
                    <div>
                        <Visuals />
                        <Register />
                        <Login />
                        <LogoutButton />
                    </div>
                } />
                <Route path="/friends" element={
                    <ProtectedRoute>
                        <div>
                            <Visuals />
                            <SendFriendRequest />
                            <FriendRequests />
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/getuser" element={<GetUserButton />} />
                <Route path="/events" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App;
