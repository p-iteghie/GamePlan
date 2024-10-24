import React, {useState} from 'react'

function LoginInput()
{
    // Define two pieces of state: one for username and one for password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh

    // Make a POST request with both username and password
    const response = await fetch('http://localhost:5000/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),  // Send both username and password
    });

    const data = await response.json();
    setResponseMessage(data.message);  // Assuming the server returns a message

    setUsername(''); // Reset username
    setPassword(''); // Reset password
    
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

        <button type="submit">Submit</button>
      </form>

    </div>
  );

};

export default LoginInput;