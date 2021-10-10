const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
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

  async create(values) {
    values.id = this.randomId();

    const records = await this.getAll();
    records.push(values);
    await this.writeAll(records);

    return values;
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
      })
    );
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