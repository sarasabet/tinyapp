const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};


// generate 6 digit random character
 generateRandomString = () => {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  return randomId;
}

app.post('/login', (req, res) => {
  const username = req.body.Login; // get user name from browser login btn/form 
  res.cookie('username',username);// set the cookie 
  res.redirect("/urls");
})

app.post('/logout', (req, res) => {
  const username = req.cookies["username"];
  console.log({username})
  res.clearCookie('username');
  res.redirect('/urls')
})

//drive to urls/new pag, affter pushing submit btn the data will be posted 
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
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
app.get ('/urls/:id' , (req, res) => {

  const shortURL = req.params.id;//get id/shortUrl from teh url bar
  const longURL = urlDatabase[shortURL];// get associate lonngurl based on the key/id/shorturl
  const templateVars = {
    longURL:longURL, 
    shortURL:shortURL,
    username: req.cookies["username"],
  };

  res.render('urls_show', templateVars);
})
app.post('/urls/:id', (req, res) => {

  urlDatabase[req.params.id] = req.body.longURL;// get shorturl/id from url bar get the editted longUrl from browser and update the db
  res.redirect('/urls');
})

// to delete specific url from db and redirect to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
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

  const templateVars = { 
    shortURL, 
    longURL:longURL, 
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

// shows all urls on main page
app.get("/urls", (req, res) => {

  const templateVars = { 
  username: req.cookies["username"],
  urls: urlDatabase,
    
  }; 
  console.log(templateVars)
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Helloooooo!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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
