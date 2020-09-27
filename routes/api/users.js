const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { set } = require('mongoose');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const normalize = require('normalize-url');

//@route    Post api/users
//@desc     register user
//@access   Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please Include a valid Email').isEmail(),
    check(
      'password',
      'Please use a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exists' }] });
      }

      // Get the Gravatar
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        }),
        { forceHttps: true }
      );

      user = new User({
        name: name,
        email: email,
        password: password,
        avatar: avatar,
      });

      //Encrypt password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return JSON Webtoken

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.send({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
