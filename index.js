const express = require('express');
const env = require('dotenv')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = env.port || 8000;
console.log(process.env.PORT);
const path=require("path");
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');


const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is running on port 5000')

app.use(cors());
app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix:'/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());


app.use(express.static('./assets'));

//make the uploads available to the browser
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// use express router


//set up the view engine
app.set('view engine','ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production mode
    secret:process.env.secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge:(1000 * 60 * 100)
    },
    store : MongoStore.create({
        
           mongoUrl: process.env.Dev_DB,
         autoRemove:'disabled'
        
    }
   
    
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/', require('./routes'));
const messages = {
    'codeial': [
        { user: 'John', message: 'Hello there!' },
        { user: 'Alice', message: 'Hi, how are you?' }
    ]
};
app.get('/api/messages', (req, res) => {
    // Get the chatroom from the query parameters
    const chatroom = req.query.chatroom;

    if (chatroom && messages[chatroom]) {
        // If the chatroom exists, send back the messages
        res.status(200).json(messages[chatroom]);
    } else {
        // If chatroom doesn't exist, send a 404
        res.status(404).json({ error: 'Chatroom not found' });
    }
});

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})