import React, {useState} from 'react'

const User = require('./loginDB/UserModel.js');

function Register()
{
    // Define two pieces of state: one for username and one for password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh

    // Make a POST request with both username and password
    const responseMessage = await fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),  // Send both username and password
    });

    const data = await responseMessage.json();
    setResponseMessage(data.message);  // Assuming the server returns a message  
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // Update username state
          />
        </div>

        {/* Password input */}
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Update password state
          />
        </div>

        <button type="submit">Register</button>
      </form>

    </div>
  );

};

export default Register;