const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const user = require('../../models/User');
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
      locations,
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
    if (locations) profileFeilds.locations = locations;
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

//@route    DELETE api/profile/user/:user_id
//@desc     remove a profiles User and Post
//@access   private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo remove users posts also
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    res.status(500).send({ msg: 'Server Error' });
  }
});

module.exports = router;
