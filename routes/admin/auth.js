const express = require('express');
const { validationResult, check } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const
  { requireEmail,
    requirePassword,
    requirePasswordConfirmation
  } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }));
});

router.post('/signup',
  [
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req: req, errors: errors }))
    }

    const { email, password, passwordConfirmation } = req.body;
    const newUser = await usersRepo.create({ email: email, password: password });
    //store the new created id inside user cookie
    req.session.userId = newUser.id;
    res.send('Account created!!!');
  });



router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out.');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin',
  [
    check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('You must provide a valid email')
      .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email: email });
        if (!user) {
          throw new Error('Unregistered email provided')
        }
      }),
    check('password').trim()
  ], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email, password } = req.body;
    const existingUser = await usersRepo.getOneBy({ email: email });
    if (!existingUser) {
      res.send('Unregistered email provided');
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

module.exports = router;