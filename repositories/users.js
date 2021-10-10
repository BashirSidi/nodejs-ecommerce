const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');
const scrypt = util.promisify(crypto.scrypt);

class UserRepositories extends Repository {
  async create(user) {
    user.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buffer = await scrypt(user.password, salt, 64);

    const records = await this.getAll();
    const record = { ...user, password: `${buffer.toString('hex')}.${salt}` };
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    //save - password saved in the database. i.e 'hashed.salt'
    //supplied - password given to us when trying to login
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    // turn the hashedSuppliedBuf to string
    return hashed === hashedSuppliedBuf.toString('hex');
  }
}

module.exports = new UserRepositories('users.json');