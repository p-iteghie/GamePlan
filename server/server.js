const express = require('express')
const cors = require('cors')
const connectDB = require('../client/src/db');
const User = require('../client/src/loginDB/UserModel.js');



const app = express()
const PORT = process.env.PORT || 3000;
connectDB();

app.use(cors());
app.use(express.json()); // Built-in body-parser for JSON
app.use(express.urlencoded({ extended: true }));




app.post('/register', (req, res) => {
    const {username, password} = req.body;

   
    const user = new User({
    username: username,
    password: password,
    });

    

    user.save().then((result) => {
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





app.listen(5000, () => {console.log("Server started on port 5000")})


