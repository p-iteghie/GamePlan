import React, {useState} from 'react'

const User = require('./loginDB/UserModel.js');

function Register()
{
    // Define two pieces of state: one for username and one for password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const [regMessage, setregMessage] = useState('');
  const [passValid, setPassValid] = useState(true);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (passwordRegex.test(password)) 
      {
      console.log("Password is valid!");
      } 
    else 
    {
        console.log("Password is invalid!");
        setregMessage("Password must be at least 8 characters long, include a number, and a capital letter.");
        setPassValid(false);
        return; // Stop submission if validation fails
    }
    setregMessage('');
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

        {/* Display error message if password is invalid */}
        {!passValid && <p style={{ color: 'red' }}>{regMessage}</p>}
        

        <button type="submit">Register</button>
      </form>

    </div>
  );

};

export default Register;