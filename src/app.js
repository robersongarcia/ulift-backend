const express =  require('express');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors')
const sequelize = require('./config/database.js');
const initModels = require('./models/init-models');
require('./config/passport.js')(passport);

const models = initModels(sequelize);

const app = express();

//mid
app.use(passport.initialize());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));  

app.get('/', (req,res) => {
    res.send('TESTING');
});

const PORT = process.env.PORT || 3000;

const auth = require('./routes/auth');
const user = require('./routes/user');

app.use('/auth', auth);
app.use('/user', passport.authenticate('jwt', {session: false}), user);

app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`);
    try {
        await sequelize.authenticate();     
        console.log('Connection to db has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

