const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

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


//drive to urls/new pag, affter pushing submit btn the data will be posted 
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();// generate a new id 
  const longURL = req.body.longURL;// get the long urld from the form / body 
  urlDatabase[shortURL] = longURL;// update db with new short/long urls
  res.redirect(`/urls/${shortURL}`);//redirection to /urls/:shortURL, where shortURL is the random string we generated
});


app.get("/u/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL;// save the shorturl comming from the url bar 
  const longURL = urlDatabase[shorturl] // lookup tthe value coresponding shorturl-key
  res.redirect(longURL);// redirect to the related long url
});

// get short url from url , save it as a var  shorturl,
// shorturl is the key on db, get the longurl with the key (shorturl,
app.get("/urls/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL; // to define shorturl to look it up in db

  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[shorturl] 
  };
  res.render("urls_show", templateVars);
});


// shows all urls on db
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
