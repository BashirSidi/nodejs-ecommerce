const express = require('express');
const { validationResult, check } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const
  { requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExist,
    requireValidUserPassword
  } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }));
});

router.post('/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req: req, errors: errors }))
    }

    const { email, password } = req.body;
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
  res.send(signinTemplate({ errors: [] }));
});

router.post('/signin',
  [requireEmailExist, requireValidUserPassword],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors: errors }));
    }

    const { email } = req.body;
    const existingUser = await usersRepo.getOneBy({ email: email });
    req.session.userId = existingUser.id;
    res.send('You are signed in!');
  });

module.exports = router;