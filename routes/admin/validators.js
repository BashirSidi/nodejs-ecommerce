const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Most be between 5 and 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Most be a number greater than 1'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('must be a valid email')
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email: email });
      if (existingUser) {
        throw new Error('Email alredy registered!');
      }
    }),

  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('must be between 4 and 20 characters'),

  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('must be between 4 and 20 characters')
    .custom(async (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Password must match')
      }
    }),
  requireEmailExist: check('email')
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
  requireValidUserPassword: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const existingUser = await usersRepo.getOneBy({ email: req.body.email });
      if (!existingUser) {
        throw new Error('Invalid password');
      }

      const validPassword = await usersRepo.comparePasswords(
        existingUser.password,
        password
      );

      if (!validPassword) {
        throw new Error('Invalid password');
      }
    }),
};