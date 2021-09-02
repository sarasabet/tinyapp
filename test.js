
const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = bcrypt.hashSync('000', saltRounds)
const hash = bcrypt.hashSync('000', saltRounds)
console.log(hash)