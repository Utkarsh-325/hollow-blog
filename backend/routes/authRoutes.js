const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({username, email, password: hash});
  await user.save();
  res.json({msg: 'User created!'});
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) return res.status(400).json({msg: 'User not found!'});
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({msg: 'Wrong password!'});
  const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn:'1h'});
  res.json({token, username: user.username});
});

module.exports = router;
