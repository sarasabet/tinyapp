const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const usersDb = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "u1@example.com", 
    password: "000"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "u2@example.com", 
    password: "000"
  },

}

// generate 6 digit random character
generateRandomString = () => {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  return randomId;
};

const getUserByEmail = (usersDb, email) => {
  for (const userObj in usersDb) {
    if(usersDb[userObj].email === email) {
      return usersDb[userObj]
    }
  }
}

//get post to render the register page and extract data , drive user to main page /urls
app.get("/register", (req, res) => {
  user_id = req.cookies["user_id"];
  const templateVars = {
    user:usersDb[user_id],
  };
  res.render("register", templateVars);
})

app.post("/register", (req, res) => {
  const email = req.body.email;// extract email from browser /register page 
  const password = req.body.password;// extract [password] from browser /register page 
  const id = generateRandomString();
  if(getUserByEmail(usersDb, email)) {
    res.send('Email exist, please login, or try again')
  } else if (!email||email.length === 0 || password.length ===0) {
    res.send("BAd Email/password. The request could not be completed")
  } 

  usersDb[id] = {//update users db with the newlly registered user
    id,
    email,
    password,
  };
  res.cookie("user_id", id);// set user cookie, id as user_id cookie
  res.redirect('/urls',);
})
// if user click on login btn drives the user to login page 
app.get("/login", (req, res) => {
  user_id = req.cookies["user_id"];
  const templateVars = {
    user:usersDb[user_id],
  };

  res.render("login", templateVars);
})

app.post('/login', (req, res) => {
  const email = req.body.email; // get user name from browser login btn/form 
  const password = req.body.password
  const user = getUserByEmail(usersDb, email);

  if (user.email !== email || user.password !== password) {
    return res.send('Email or password is not match!')
  };
  const user_id = user.id;
  res.cookie('user_id', user_id);
  res.redirect("/urls");
})

app.post('/logout', (req, res) => {
  const user_id = req.cookies["user_id"];
  res.clearCookie('user_id');// delet the cookie from browser
  res.redirect('/urls')
})

//drive to urls/new pag, affter pushing submit btn the data will be posted 
app.get("/urls/new", (req, res) => {
  user_id = req.cookies["user_id"];
  const templateVars = {
    user: usersDb[user_id],
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req, res) => {
  const shortURL = generateRandomString();// generate a new id 
  const longURL = req.body.longURL;// get the long urld from the form / body 
  urlDatabase[shortURL] = `http://${longURL}`;// update db with new short/long urls
  res.redirect("/urls");
});

//get post routs for editing an existing url
app.get('/urls/:id', (req, res) => {

  const shortURL = req.params.id;//get id/shortUrl from teh url bar
  const longURL = urlDatabase[shortURL];// get associate lonngurl based on the key/id/shorturl
  user_id = req.cookies["user_id"];
  const templateVars = {
    longURL: longURL,
    shortURL: shortURL,
    user:usersDb[user_id],
  };

  res.render('urls_show', templateVars);
})
app.post('/urls/:id', (req, res) => {

  urlDatabase[req.params.id] = req.body.longURL;// get shorturl/id from url bar get the editted longUrl from browser and update the db
  res.redirect('/urls');
})

// to delete specific url from db and redirect to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
})

app.get("/u/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL;// save the shorturl comming from the url bar 
  const longURL = urlDatabase[shorturl] // lookup tthe value coresponding shorturl-key
  res.redirect(longURL);// redirect to the related long url
});

// get short url from url , save it as a var  shorturl,
// shorturl is the key on db, get the longurl with the key (shorturl,
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; // to define shorturl to look it up in db
  const longURL = urlDatabase[shortURL]
  user_id = req.cookies["user_id"];
  const templateVars = {
    shortURL,
    longURL: longURL,
    user:usersDb[user_id],
  };
  res.render("urls_show", templateVars);
});

// shows all urls on main page
app.get("/urls", (req, res) => {
  user_id = req.cookies["user_id"];

  const templateVars = {
    user:usersDb[user_id],
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Helloooooo!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(usersDb);
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
