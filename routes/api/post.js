const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { find } = require('../../models/User');

const checkObjectId = require('../../middleware/checkObjectId');

//@route    POST api/post
//@desc     create Post
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

//@route    PUT api/post/like/:post_id
//@desc     Like a Post
//@access   private

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/post/unlike/:post_id
//@desc     Unlike a Post
//@access   private

router.put('/unlike/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).send('Not yet Liked');
    }
    removeIndex = post.likes
      .map((like) => like.user)
      .toString()
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/post/comment/:post_id
//@desc     Comment on a Post
//@access   private

router.post(
  '/comment/:post_id',
  [auth, [check('text', 'Text is Required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not Found' });
      }

      const newComment = {
        user: req.user.id,
        name: user.name,
        text: req.body.text,
        avatar: user.avatar,
      };
      console.log(user.name);

      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not Found' });
      }
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    DELETE api/post/comment/:post_id/:comment_id
//@desc     remove a comment by id
//@access   private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!post) {
      return res.status(404).json({ msg: 'Comment not Found' });
    }
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not Found' });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Authorised' });
    }
    //find the comment
    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );
    await post.save();

    return res.json(post.comments);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not Found' });
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
