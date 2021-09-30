const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UserRepositories {
  constructor(filename) {
    if (!filename) {
      throw new Error('creating a repository requires a filename');
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
      })
    );
  }

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

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const users = await this.getAll();
    return users.find(user => user.id === id);
  }

  async delete(id) {
    const users = await this.getAll();
    const filteredUsers = users.filter(user => user.id !== id);
    await this.writeAll(filteredUsers);
  }

  async update(id, userUpdate) {
    const users = await this.getAll();
    const user = users.find(user => user.id === id);

    if (!user) {
      throw new Error(`User with the id ${id} not found!`);
    }

    Object.assign(user, userUpdate);
    await this.writeAll(users);
  }

  async getOneBy(filters) {
    const users = await this.getAll();

    for (let user of users) {
      let found = true;

      for (let key in filters) {
        if (user[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return user;
      }
    }
  }

}

module.exports = new UserRepositories('users.json');