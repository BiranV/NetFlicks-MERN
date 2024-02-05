const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose")
const moviesRouter = require("./routes/index")
require("dotenv").config();

const port = process.env.PORT || 5000
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("App connected to database");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

app.use('/', moviesRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${ port }`)
});

