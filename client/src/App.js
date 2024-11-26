import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Visuals from './Visuals';
import Register from './Register';
import AddEvent from './AddEvent';
import { Login, GetUserButton } from './Login';
import SendFriendRequest from './Friends'


function App() {
    return (
        <div>
            <nav className="navbar">
                <Link to="/" className="nav-link">Home | </Link>
                <Link to="/register" className="nav-link">Register | </Link>
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
                        <SendFriendRequest />
                    </div>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/getuser" element={<GetUserButton />} />
                <Route path="/events" element={<AddEvent />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App;
