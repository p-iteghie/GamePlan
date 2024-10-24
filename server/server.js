const express = require('express')
const cors = require('cors')
const connectDB = require('../client/src/db');
const authRoutes = require('../client/src/routes/auth');
const userRoutes = require('../client/src/routes/user');

const app = express()
const PORT = process.env.PORT || 3000;
connectDB();

app.use(cors());
app.use(express.json()); // Built-in body-parser for JSON
app.use(express.urlencoded({ extended: true }));

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);



app.post('/submit', (req, res) => {
    const {username, password} = req.body;
    console.log("Submitted form\n");
    console.log(`Username: ${username}, Password: ${password}`);
    res.send({ message: `Received text: ${username, password}` });

});

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})

})

app.listen(5000, () => {console.log("Server started on port 5000")})


