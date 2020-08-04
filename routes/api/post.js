const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { find } = require('../../models/User');

//@route    POST api/post
//@desc     create POst
//@access   private
router.post(
  '/',
  [auth, [check('text', 'text is Required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        user: req.user.id,
        name: user.name,
        text: req.body.text,
        avatar: user.avatar,
      });
      const post = await newPost.save();
      return res.send(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    GET api/post
//@desc     Get all Posts
//@access   private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/post/:post_id
//@desc     Get Post by id
//@access   private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    DELETE api/post/:post_id
//@desc     DELETE Post by id
//@access   private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Authorised' });
    }
    await post.remove();
    return res.json({ msg: 'Post Removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
