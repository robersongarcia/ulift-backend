const express =  require('express');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require('./config/database');
const initModels = require('./models/init-models')(sequelize);
path = require('path');
require('./config/passport')(passport);
global.__basedir = __dirname;
const public = path.join(__dirname, 'public');

const app = express();

//middlewares
app.use(express.static(public));
app.use(passport.initialize());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));  

const PORT = process.env.PORT || 3002;

//routes
const auth = require('./routes/auth.routes');
const user = require('./routes/user.routes');
const favorites = require('./routes/favorites.routes');
const lift = require('./routes/lift.routes');
const messages = require('./routes/message.routes');

//routing
app.use('/api', auth);
app.use('/api/user', passport.authenticate('jwt', {session: false}), user);
app.use('/api/favorites', passport.authenticate('jwt', {session: false}), favorites); 
app.use('/api/lift', passport.authenticate('jwt', {session: false}), lift);
app.use('/api/chat', passport.authenticate('jwt', {session: false}), messages);

app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
    try {
        await sequelize.authenticate();     
        console.log('Connection to db has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

//server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) =>{
    console.log("User connected ", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected ", socket.id);
    });    
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});

// Default message
app.get('/', (req, res) => {
    res.json({message: 'API is working'});
});