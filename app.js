/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
//var flash = require('express-flash');
//var cookieParser = require('cookie-parser');
//var methodOverride = require('method-override');
//var expressValidator = require('express-validator');
//app.use(expressValidator());
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : 'Ismchathu92',
              database : 'test'
            });

connection.connect();

global.db = connection;

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./views'));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }));

// development only

app.get('/', routes.index);//call for main index page
app.get('/index', routes.index);
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post
app.get('/login', user.login);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
app.get('/institute', user.institute);//call for institute
app.post('/institute', user.institute);//call for institute post
app.get('/doctor', user.doctor);//call for doctor addition
app.post('/doctor', user.doctor);//call for doctor post
app.get('/institutelist', user.institutelist);
app.get('/doctorslist', user.doctorslist);
app.get('/instituteedit/(:id)', user.instituteedit);
app.post('/instituteupdate/(:id)', user.instituteupdate);
app.post('/deleteinstitute/(:id)', user.deleteinstitute);
app.get('/doctoredit/(:id)', user.doctoredit);
app.post('/doctorupdate/(:id)', user.doctorupdate);
app.post('/deletedoctor/(:id)', user.deletedoctor);
app.get('/search', user.search);
app.get('/finddoctor', user.finddoctor);
app.get('/findbyspeciality', user.findbyspeciality);
app.get('/findinstitute', user.findinstitute);
app.get('/echanneling', user.echanneling);
app.get('/memberhome', user.memberhome);
app.get('/myappointments', user.myappointments);
app.get('/adminhome', user.adminhome);

//app.use(flash());
//Middleware
app.listen(8080);
console.log('The magic happens on port 8080');
