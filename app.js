const express = require('express');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectToDB = require('./config/DB');
const passport = require('passport');
const methodOverride = require('method-override')

dotenv.config({ path: './config/config.env' });

require('./config/passport')(passport);

connectToDB();

const app = express();

// body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())


//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const {formatDate,truncate,stripTags,editIcon,select} = require('./helpers/hbs')

app.engine('handlebars', engine({
    helpers:{
        formatDate,
        truncate,
        stripTags,
        editIcon,
        select
    }
}));
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

// set global var
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`App is running on PORT : ${port} and in ${process.env.NODE_ENV} mode`);
});
