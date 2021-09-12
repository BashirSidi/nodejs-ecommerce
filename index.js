const express = require('express');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['shfsdjkgfhjsekgessjkdfg']
}));

app.get('/', (req, res) => {
  res.send(`
    <div>
      Your id is ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="confirm password" />
        <button>Sign up</button>
      </form>
    </div>
  `);
});

app.post('/', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email: email });

  if (existingUser) {
    return res.send('Email alredy registered!');
  }

  if (password !== passwordConfirmation) {
    return res.send('Password must match!')
  }

  //create new user
  const newUser = await usersRepo.create({ email: email, password: password });

  //store the new created id inside user cookie
  req.session.userId = newUser.id;


  res.send('Account created!!!');
});

app.listen(3000, () => {
  console.log("Server started...")
})