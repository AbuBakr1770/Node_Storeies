const express = require('express');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectToDB = require('./config/DB');
const passport = require('passport');

dotenv.config({ path: './config/config.env' });

require('./config/passport')(passport);

connectToDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        // mongooseConnection: mongoose.connection,
        mongoUrl: process.env.MONGO_URL_pass,         
        collection: 'sessions',
        ttl: 60 * 60 * 24 // session TTL in seconds
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`App is running on PORT : ${port} and in ${process.env.NODE_ENV} mode`);
});
