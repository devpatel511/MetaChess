const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://devpatel511:<password>@cluster0.xegjhfz.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connect to DB"))
    .catch(console.error);

app.listen(3001, () => console.log("Server started on port 3001"));