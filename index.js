const express = require('express');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['shfsdjkgfhjsekgessjkdfg']
}));

app.get('/signup', (req, res) => {
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

app.post('/signup', async (req, res) => {
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



app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out.');
});

app.get('/signin', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `);
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await usersRepo.getOneBy({ email: email });
  if (!existingUser) {
    res.send('You entered unregistered email');
  }

  const validPassword = await usersRepo.comparePasswords(
    existingUser.password,
    password
  );

  if (!validPassword) {
    res.send('Invalid password');
  }

  req.session.userId = existingUser.id;

  res.send('You are signed in!')
});

app.listen(3000, () => {
  console.log("Server started...")
})