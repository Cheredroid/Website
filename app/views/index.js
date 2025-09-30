const path = require('path');
const express = require('express');
const cors = require('cors');
const debug = require('debug')('c:i:');
// const { guard } = require('./controllers/auth');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const sequelize = require('./models').sequelize;

const app = express();

// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }));

app.use(session({
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
   cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,  //tiene que estar en falso en desarrollo
    maxAge: 1000*60*60*24*7
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');


//Para crear la coneccion entre sequelize y el DB
// 1. Entra el app o src folder donde tienes el mvc y si tienes models borralo ya que sequelize lo va crear
// 2. En el terminal corre el commando npx sequelize-cli init
// 3. adentro del folder de config hay un archivo con nombre de diferentes ambientes, solo cambia el de development.
// 4. Para crear modelos usa este ejemplo: npx sequelize-cli model:generate --name trainers --attributes name:string,lastname:string,age:integer,username:string,password:string
// despues de attributes no puedes dejar espacios, todo los attributos se escriben variable:typo,variable:typo ect
// 5. una vez terminado ve adentro del folder de models y busca el modelo que acabaste de crear
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

const routers = require('./routes');


app.use("/", routers);

// app.get('/', (req, res) => {
//     res.send("hello world")
// })


// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).render('404');
  next();
});

// Error-handling middleware
app.use((err, req, res, next) => {
  debug('ERROR FOUND:', err);  // Log the error using 'debug'
  res.status(500).send('Internal Server Error'); // Send a response to the client
});

module.exports = app;