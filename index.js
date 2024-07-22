const express = require("express");
require("dotenv").config();
const port = process.env.APP_PORT;
const router = require("./routes");
const dbUrl = process.env.DB_URL;
const errorHandler = require("./middleware/errorHandler")
const cors = require('cors');
const path = require('path');



const mongoose = require("mongoose")
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connection Successful !");
});

const app= express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://82.112.226.134/app1/',
  'https://vectorinstruments.netlify.app'
];

app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin, like mobile apps or curl requests
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use('/api',router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
