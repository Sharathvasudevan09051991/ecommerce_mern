const express = require("express");
const router = express.Router();
const {signup, signin, isAuth, isAdmin} = require("../controllers/auth");
const auth = require("../middleware/auth");
const User = require("../models/user");

router.post('/signup', signup);
router.post('/signin', signin);


router.get('/', auth, isAuth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
 

module.exports = router;


