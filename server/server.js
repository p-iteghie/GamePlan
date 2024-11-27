const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { connectDB, clearDatabase } = require('../client/src/db');
const User = require('../client/src/loginDB/UserModel.js');
const Event = require('../client/src/loginDB/EventModel.js');




const app = express()
const PORT = process.env.PORT || 3000;
connectDB();
//clearDatabase(); IF YOU WANT TO CLEAR DB


app.use(cors());
app.use(express.json()); // Built-in body-parser for JSON
app.use(express.urlencoded({ extended: true }));




app.post('/register', (req, res) => {

    const { username, password } = req.body;


   
        bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            //console.log("Hashed Password:", hashedPassword);
            const user = new User({
                username: username,
                password: hashedPassword,
              });

              return user.save();
        
        })

    .then((result) => {
        res.status(201).send({
            message: "User Created Successfully",
            result,
        });
        console.log("Submitted form and user saved\n");

        

        console.log(`Username: ${username}, Password: ${password}`);
        })
        .catch((error) => {
        res.status(500).send({
            message: "Error creating user",
            error,
        });
        console.log("User not created because it is a duplicate username. Did you mean to login?");
        });
});

app.post('/login', (req, res) => {
    User.findOne({ username: req.body.username })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      if (!user) {
        console.log("Username not found");
        return res.status(404).send({ message: "User not found" });
      }

      
        return bcrypt.compare(req.body.password, user.password)
        // if the passwords match
        .then((passwordMatch) => {
          // check if password matches
          if(!passwordMatch) {
            console.log("passwords do not match failed passwordChck");
            return res.status(400).send({
              message: "Passwords does not match",
              error,
            });

          }

          //   create JWT token
          const token = jwt.sign(
            {
              username: user.username,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
            //increase security with user id and super secret key
          );

          //   return success response
          console.log("Login successful");

        return res.json({ token: token });
        })
        // catch error if password does not match
        .catch((error) => {
          res.status(400).send({
            message: "Passwords does not match",
            error,
          });
          console.log("Passwords do not match");
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      res.status(404).send({
        message: "Email not found",
        e,
      });
      console.log("Username not found");
    });


});


app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    console.log('Fetched User Data:', users); // Log to the terminal
    res.json(users); // Return the data to the frontend
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
  //console.log(users);
});

app.post('/events', async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the header

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            // Decode the token
            const decoded = jwt.verify(token, 'RANDOM-TOKEN'); // Replace with your secret key
            console.log('Decoded token:', decoded); // Check if the token decodes properly

            const loggedInUsername = decoded.username; // Extract the username from the token

            if (!loggedInUsername) {
                return res.status(400).json({ message: 'Username not found in token' });
            }

            // Find the user using the username decoded from the token
            const user = await User.findOne({ username: loggedInUsername });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('User found:', user); // Log the user to check the fetched user details

            // Extract event data from the request body
            const { title, description, startTime, endTime, location, attendees } = req.body;

            // Create a new event with the logged-in user's ID (from the decoded token)
            const event = new Event({
                title,
                description,
                startTime,
                endTime,
                location,
                userId: user._id, // Use the logged-in user's _id
                attendees,
            });

            const savedEvent = await event.save();

            // Add the event to the logged-in user's calendar
            user.calendar.push(savedEvent._id);
            await user.save();

            // Add the event to attendees' calendars
            for (const attendeeId of attendees) {
                const attendee = await User.findOne({ _id: attendeeId }); // Use _id instead of username
                if (attendee) {
                    attendee.calendar.push(savedEvent._id);
                    await attendee.save();
                }
            }

            res.status(200).json({ message: 'Event added successfully', event: savedEvent });
        } catch (error) {
            console.error('Error decoding token or fetching user:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    } catch (error) {
        console.error('Error extracting token:', error);
        return res.status(401).json({ message: 'Token error' });
    }
});

// Route to send friend request
app.post('/send-friend-request', async (req, res) => {
    const { username } = req.body;

    const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the header

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, 'RANDOM-TOKEN'); // Replace with your secret key
        console.log('Decoded token:', decoded); // Check if the token decodes properly

        const loggedInUsername = decoded.username; // Extract the username from the token

        if (!loggedInUsername) {
            return res.status(400).json({ message: 'Username not found in token' });
        }

        // Find the user using the username decoded from the token
        const user = await User.findOne({ username: loggedInUsername });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        // Find the target user by username
        const targetUser = await User.findOne({ username });
        console.log(targetUser);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if it's not the logged-in user
        if (targetUser.username.toString() === user.username.toString()) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        // Check if the friend request has already been sent
        if (targetUser.friendReqs.includes(user._id)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        // Add the logged-in user to the target user's friend requests
        targetUser.friendReqs.push(user);
        await targetUser.save();

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/getevents', async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the header
    
    if (!token) {
        
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, 'RANDOM-TOKEN'); // Replace with your secret key
        console.log('Decoded token:', decoded); // Check if the token decodes properly

        const loggedInUsername = decoded.username; // Extract the username from the token

        if (!loggedInUsername) {
            return res.status(400).json({ message: 'Username not found in token' });
        }

        // Find the user using the username decoded from the token
        const user = await User.findOne({ username: loggedInUsername }).populate('calendar');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Events found:', user.calendar);

        res.json(user.calendar); // Return the data to the frontend
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Server Error');
    }
    
});




app.listen(5000, () => {console.log("Server started on port 5000")})


