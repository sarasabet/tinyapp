const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateRandomString, getUserByEmail, isUrlForUSer, urlsForAUser } = require("./helpers");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
// this midlewareprotect all pages againt not login user having access to them
app.use((req, res, next) => {
  const user_id = req.session.user_id;
  if (req.path === "/login" || req.path === "/register" || user_id) {
    return next();
  }
  return res.redirect('/login');
});

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "xJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const usersDb = {
  "xJ48lW": {
    id: "xJ48lW",
    email: "1@gmail.com",
    password: "$2b$10$chU0Eqy0Ho.noGFacMU/r.WOUDd5iao4oRcnScutP/lbRyWF8PpNq"// actual pass 000
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "2@gmail.com",
    password: "$2b$10$chU0Eqy0Ho.noGFacMU/r.WOUDd5iao4oRcnScutP/lbRyWF8PpNq"// actual pass 000
  },
};

//get post to render the register page and extract data , drive user to main page /urls
app.get("/register", (req, res) => {
  if(req.session["user_id"]) {
    return res.redirect("/urls")
  }
  const templateVars = {
    user: undefined,
  };

  res.render("register", templateVars);
});

// extract email/pass from browser /register page 
//if the email does not exist, update users db with the newlly registered user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  const user = getUserByEmail(usersDb, email);
  if (!email || !password) {
    return res.send("<h4><p style='text-align: center;'><a href='/register'>Emial/password field can not be empty!</a></p></h4>");
  }
  if (user) {
    res.send("<h4><p style='text-align: center;'><a href='/login'>Emial already exist!</a></p></h4>");
  }
  usersDb[id] = {
    id,
    email,
    password: bcrypt.hashSync(password, saltRounds)
  };
  req.session["user_id"] = id;
  res.redirect('/urls',);
});

// if user click on login btn drives the user to login page 
app.get("/login", (req, res) => {
  if(req.session["user_id"]) {
    return res.redirect("/urls")
  }
  req.session = null;

  const templateVars = {
    user: undefined,
  };
  res.render("login", templateVars);
});

// get user name from browser login btn/form 
//if the pass/email is not match => error else login set the cookie
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(usersDb, email);
  if (!email || !password) {
    return res.send("<h4><p style='text-align: center;'><a href='/login'>Emial/password field can not be empty!</a></p></h4>");
  }
  if (user.email !== email || !bcrypt.compareSync(password, user.password)) {
    return res.send("<h4><p style='text-align: center;'><a href='/login'>Emial/password is not match!</a></p></h4>");
  }
  req.session.user_id = user.id;

  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  req.session = null;// delet the cookie from browser
  res.redirect('/urls');
});

//drive to urls/new pag, affter pushing submit btn the data will be posted
app.get("/urls/new", (req, res) => {
  const user_id = req.session["user_id"];
  const templateVars = {
    user: usersDb[user_id],
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req, res) => {
  const shortURL = generateRandomString();// generate a new id
  const longURL = req.body.longURL;// get the long urld from the form / body 
  const user_id = req.session["user_id"];

  urlDatabase[shortURL] = {
    longURL: `${longURL}`,// update db with new short/long urls
    userID: user_id,
  };
  res.redirect("/urls");
});

//get post routs for editing an existing url
app.get('/urls/:id', (req, res) => {
  const user_id = req.session.user_id;
  const user = usersDb[user_id];
  const shortURL = req.params.id;//get id/shortUrl from teh url bar
  if (!urlDatabase[shortURL]) {
    return res.send("<h4><p style='text-align: center;'><a href='/urls'>please choose proper url</a></p></h4>");
  }
  const longURL = urlDatabase[shortURL].longURL;// get associate lonngurl based on the key/id/shorturl

  if (!isUrlForUSer(urlDatabase, user, shortURL)) {
    return res.send("<h4><p style='text-align: center;'><a href='/urls'>Unauthorized action, please choose proper url</a></p></h4>");
  }
  const templateVars = {
    longURL: longURL,
    shortURL: shortURL,
    user: usersDb[user_id],
  };

  res.render('urls_show', templateVars);
});

app.post('/urls/:id', (req, res) => {
  const user_id = req.session["user_id"];
  const user = usersDb[user_id];
  const shortURL = req.params.id;

  if (!isUrlForUSer(urlDatabase, user, shortURL)) {
    return res.send("<h4><p style='text-align: center;'><a href='/urls'>Unauthorized action, please choose proper ur</a></p></h4>");
  }
  urlDatabase[req.params.id].longURL = `${req.body.longURL}`;// get shorturl/id from url bar & editted longUrl from browser and update the db
  res.redirect('/urls');
});

// to delete specific url from db and redirect to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.session["user_id"];
  const user = usersDb[user_id];
  const shortURL = req.params.shortURL;

  if (!isUrlForUSer(urlDatabase, user, shortURL)) {
    return res.send("<h4><p style='text-align: center;'><a href='/urls'>Unauthorized action, please choose proper ur</a></p></h4>");
  }
  delete urlDatabase[shortURL];

  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL;// save the shorturl comming from the url bar
  const shortUrls = Object.keys(urlDatabase);
  if ((!shortUrls.includes(shorturl))) {
    return res.send("<h4><p style='text-align: center;'><a href='/urls'>NOt a valid Url</a></p></h4>");
  }
  const longURL = urlDatabase[shorturl].longURL; // lookup tthe value coresponding shorturl-key


  res.redirect(longURL);// redirect to the related long url
});

// get short url from url , save it as a var  shorturl,
// shorturl is the key in db, get the longurl with the key,
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  const shortURL = req.params.shortURL; // to define 
  const longURL = urlDatabase[shortURL].longURL;

  const templateVars = {
    shortURL,
    longURL: longURL,
    user: usersDb[user_id],
  };

  res.render("urls_show", templateVars);
});

// shows all urls on main page
app.get("/urls", (req, res) => {
  const user_id = req.session["user_id"];

  const templateVars = {
    user: usersDb[user_id],
    urls: urlsForAUser(urlDatabase, user_id),
  };

  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  return res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});
