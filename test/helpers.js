const { assert } = require('chai');

const { getUserByEmail ,isUrlForUSer} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "userRandomID"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "ser2RandomID"
  }
};


describe('getUserByEmail', function() {
  it('should return an email', function() {
    const user = getUserByEmail(testUsers, "user2@example.com").email
    const expectedOutput = "user2@example.com"
    assert.equal( expectedOutput, user)
  });
  it('should return flase', function() {
    const user = getUserByEmail(testUsers, "")
    const expectedOutput = false;
    assert.equal( expectedOutput, user)
  });
  it('should returnuser  password', function() {
    const user = getUserByEmail(testUsers, "user2@example.com").password;
    const expectedOutput = "dishwasher-funk";
    assert.equal( expectedOutput, user)
  });

});


describe('isUrlForUSer', function () {
  it ("Should return true ", function(){
    const result = isUrlForUSer(urlDatabase, testUsers["userRandomID"],"b6UTxQ" );
    const expectedOutput = true
    assert.equal(expectedOutput, result)
  })

  it ("Should return true ", function(){
    const result = isUrlForUSer(urlDatabase, "userRan","b6UTxQ" );
    const expectedOutput = false
    assert.equal(expectedOutput, result)
  })
})

