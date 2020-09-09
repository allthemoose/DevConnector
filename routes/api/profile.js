const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');

//@route    GET api/profile/me
//@desc     return my profile
//@access   private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no Profile for this User' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: 'Server error' });
  }
});

//@route    Post api/profile
//@desc     Create or Update profile
//@access   private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'At least One Skill is required').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      user,
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      experience,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Check for entry before DB add.
    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if (company) profileFeilds.company = company;
    if (website) profileFeilds.website = website;
    if (location) profileFeilds.location = location;
    if (status) profileFeilds.status = status;
    if (skills) {
      profileFeilds.skills = skills.split(',').map((skill) => skill.trim());
    }
    if (bio) profileFeilds.bio = bio;
    if (githubusername) profileFeilds.githubusername = githubusername;
    if (experience) profileFeilds.experience = experience;

    profileFeilds.social = {};
    if (youtube) profileFeilds.social.youtube = youtube;
    if (twitter) profileFeilds.social.twitter = twitter;
    if (facebook) profileFeilds.social.facebook = facebook;
    if (instagram) profileFeilds.social.instagram = instagram;
    if (linkedin) profileFeilds.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({
        user: req.user.id,
      });
      //update existing
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        );
        return res.json(profile);
      }
      // create new
      profile = new Profile(profileFeilds);
      await profile.save();
      return res.send(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ msg: 'Server error' });
    }
  }
);

//@route    get api/profile
//@desc     return all profiles or one based on userId
//@access   public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: 'Server Error' });
  }
});

//@route    get api/profile/user/:user_id
//@desc     return all profiles or one based on userId
//@access   public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    res.status(500).send({ msg: 'Server Error' });
  }
});

//@route    DELETE api/profile
//@desc     remove a profiles User and Post
//@access   private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo remove users posts also
    await Post.deleteMany({ user: req.user.id });
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: 'Server Error' });
  }
});

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   private
//@todo could add functionality to update experiences as an excercise.
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is Required').not().isEmpty(),
      check('company', 'Company is Required').not().isEmpty(),
      check('from', 'From Date is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      } = req.body;

      const experienceFeilds = {};
      experienceFeilds.title = title;
      experienceFeilds.company = company;
      if (location) experienceFeilds.location = location;
      experienceFeilds.from = from;
      if (to) experienceFeilds.to = to;
      if (current) experienceFeilds.current = current;
      if (description) experienceFeilds.description = description;

      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(experienceFeilds);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.sendStatus(400).json({ msg: 'Server Error' });
    }
  }
);

//@route    DELETE api/profile/experience/:exp_id
//@desc     REMOVE profile experience
//@access   private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    if (removeIndex < 0) {
      return res.status(400).json({ msg: 'Server Error' });
    }
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: 'Server Error' });
  }
});

//@route    PUT api/profile/education
//@desc     Add profile education
//@access   private
//@todo could add functionality to update education as an excercise.

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is Required').not().isEmpty(),
      check('degree', 'degree is Required').not().isEmpty(),
      check('fieldofstudy', 'Field of Study is Required').not().isEmpty(),
      check('from', 'From Date is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      } = req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.sendStatus(400).json({ msg: 'Server Error' });
    }
  }
);

//@route    DELETE api/profile/education/:edu_id
//@desc     REMOVE profile education
//@access   private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    if (removeIndex < 0) {
      return res.status(400).json({ msg: 'Server Error' });
    }
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: 'Server Error' });
  }
});

//@route    GET api/profile/github/:username
//@desc     Retreive User Repositories
//@access   public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'User-Agent': 'allthemoose' },
    };
    //console.log(options.uri);
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode == 200) {
        return res.json(JSON.parse(body));
      }
      return res.status(404).json({ msg: 'no Github profile found' });
    });
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
