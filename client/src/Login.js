import React, {useState} from 'react'

const User = require('./loginDB/UserModel.js');

function Login()
{
    // Define two pieces of state: one for username and one for password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh

    // Make a POST request with both username and password
    const responseMessage = await fetch('http://localhost:5000/login', {
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

        <button type="submit">Login</button>
      </form>

    </div>
  );

};


const GetUserButton = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/users'); // Fetch from your endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUserData(data);

      
      console.log('Fetched User Data:', data); // Print to the browser console
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchUserData}>Get User Data</button>
    </div>

    
  );
};

export { Login, GetUserButton };