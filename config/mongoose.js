const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const Mongodb = process.env.Dev_DB;

// mongoose.connect("mongodb+srv://araj8764:oWLDyam0j2VLB00k@cluster0.aatwmd2.mongodb.net/");
mongoose.connect(Mongodb, {useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("CONNECTION ESTABLISHED"));


const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;