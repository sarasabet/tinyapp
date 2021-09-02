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

const urlsForUser = (urlDatabase, userObj, shortURL) => {

  let userID = urlDatabase[shortURL].userID;
  if (userID === userObj.id) {
    return true; 
  } else {
    return false;
  }
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,

};
