const  generateRandomString = () => {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  return randomId;
};

const getUserByEmail = (usersDb, email) => {
  for (const userObj in usersDb) {
    if(usersDb[userObj].email === email) {
      return usersDb[userObj];
    }
  }
  return false;
};

const isUrlForUSer = (urlDatabase, userObj, shortURL) => {

  let userID = urlDatabase[shortURL].userID;
  if (userID === userObj.id) {
    return true; 
  } else {
    return false;
  }
};

const urlsForAUser = (urlDatabase, user_id) => {
  let urlObj = {};
  for ( const url in urlDatabase) {
    if (user_id === urlDatabase[url].userID) {
      urlObj[url] =  urlDatabase[url];
    }
  }
  return urlObj;
}

module.exports = {
  generateRandomString,
  getUserByEmail,
  isUrlForUSer,
  urlsForAUser

};
