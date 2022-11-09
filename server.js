const routerTest = require('./routes/test.js');
const routerRandom = require('./routes/random.js');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const info = require("./utils/info");
const dotenv = require("dotenv");
const cluster=require('cluster');
const numCpus=require('os').cpus().length;
const compression = require('compression');
const gzipMiddleware = compression();
const logger = require('./utils/loggerConfig.js');

dotenv.config();

const connectToMongoDB = require('./mongoDB/index');
const { normalizeMsg } = require('./normalizr.js')
const { MsgModel } = require("./mongoDB/schemas/message");
const Contenedor = require("./Contenedor");

const { Types } = require("mongoose");
const User=require("./mongoDB/schemas/userSchema");
const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport");
const { comparePassword, hashPassword } = require("./utils/hashPassword");

const session = require('express-session')
const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))
app.use(session({
  //Base de datos Mongo
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@coder.nrxnhkn.mongodb.net/ecommerce?retryWrites=true&w=majority`,
    mongoOptions: advancedOptions,
    ttl: 60 * 10,
    retries: 0
  }),
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));

const hbs = handlebars.create({
  helpers: {
    isdefined: function (value) { return value !== undefined;}
  },
  extname: ".hbs",
  defaultLayout: "index",
  layoutsDir: __dirname + "/views/layout",
  partialsDir: __dirname + "/views/partials"
});

app.engine("hbs", hbs.engine);
app.set('views', "./views");
app.set("view engine", "hbs");

app.use(passport.initialize())
app.use(passport.session())

let contenedor = new Contenedor(MsgModel);

connectToMongoDB()
  .then(() => logger.log('info','Conectado con éxito a la base de datos'))
  .catch((err) => logger.log('error',`Error: ${err}`))

io.on("connection", async (socket) => {

  const message = await contenedor.getAll();
  io.emit("update-messages", normalizeMsg(message));

  socket.emit("products");

  socket.on("post-message", async (msg) => {
    await contenedor.save(msg);
    const message = await contenedor.getAll();
    io.emit("update-messages", normalizeMsg(message));
  });
});

app.use(passport.initialize());
app.use(passport.session());

//Login user

passport.use("login", new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ username });

  if(user) {
    const passHash = user.password;
    if(!comparePassword(password, passHash))
      return done(null, null, { message: "Invalid username or password" });
  } else
    return done(null, null, { message: "Invalid username or password" });

  return done(null, user);
}));

//Registro user

passport.use("signup", new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
  const user = await User.findOne({ username });
  if (user) {
   return done(new Error("El usuario ya existe!"),
   null);
  };
  const hashedPassword = hashPassword(password);
  const newUser = new User({ username, password: hashedPassword  });
  await newUser.save();
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  id = Types.ObjectId(id);
  const user = await User.findById(id);
  done(null, user);
});




app.get('/',(req, res) =>{
  try {
    logger.log('info', `Ruta ${req.url}`)
    if (req.session.user) {
      res.render('main');
    } else {
      res.render('login');
    }
  } catch (err) {
      logger.log('error', err);
  }
});

app.post("/login", passport.authenticate("login", { failureRedirect: "/loginFail"}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

app.get('/login', (req, res) => {
  if (req.session.user.username) {
    const usuario = req.session.user.username;
    res.send({ user: usuario })
  } else {
    res.send({ user: 'No existe' })
  }
});

app.get('/logout', (req, res) => {
  const user = req.session ? req.session.user.username : undefined;
  req.session.destroy((err) => {
    if (err) {
      logger.log('error', err);
    } else {
      if(user)
        res.render('logout', {user: user});
      else
        res.redirect('/');
    }
  });
});

app.post("/signup", passport.authenticate("signup", { failureRedirect: "/signupFail"}), (req, res) => {  
  req.session.user = req.user;
  res.redirect("/");
});

app.get('/signup', (req, res) => {
  res.render('register');
});

app.get("/loginFail", (req, res) => {
  res.render('loginFailed');
});

app.get("/signupFail", (req, res) => {
  res.render('registerFailed');
});

app.get("/info", (req, res) => {
  if(req.session.user){
    res.render('info', info)
    logger.log('info', 'Ruta exitosa');
  }
  else
    res.redirect("/");
});

app.get("/infozip", gzipMiddleware,(req, res) => {
  if(req.session.user){
    logger.log('info', 'Ruta exitosa');
    res.render('info', info)
  }
  else
    res.redirect("/");
});

app.get('/*', (req, res) => {
  logger.log("warn", `Ruta no encontrada ${req.url}`);
  res.status(404).send(`Ruta no encontrada ${req.url}`);
})

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  var result = 'App is running'
  response.send(result);
}).listen(app.get('port'), function() {
  console.log('App is running, server is listening on port ', app.get('port'));
});

app.use("/api/products-test", routerTest);
app.use('/api/random', routerRandom) 



server.on("Error", (error) => logger.log('error',error));