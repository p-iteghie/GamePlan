const express = require('express')
const cors = require('cors')
const app = express()


app.use(cors());
app.use(express.json()); // Built-in body-parser for JSON
app.use(express.urlencoded({ extended: true }));

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