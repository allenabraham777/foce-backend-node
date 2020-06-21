const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
// const upload = multer({ dest: 'upload/' });
const upload = multer({ storage: multer.memoryStorage() });
const type = upload.single('image');
const cors = require('cors');
const timeout = require('connect-timeout');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/auth');
const predictRouter = require('./routes/predict');

const app = express();

// DB Config
dotenv.config();


// Connect to mongo
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(
    () => {
      console.log("Database connected");
    }
  )
  .catch((err) => {
    console.log(err);
  });

// View Enjine
app.use(timeout(300000));
app.use(haltOnTimedout);
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(type); 

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/prediction', predictRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err.message);
  
  res.status(err.status || 500);
  res.render('error');
});

function haltOnTimedout(req, res, next){
  if (!req.timedout)
    next();
}

module.exports = app;
