const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //Check unique user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exist" });
    }

    //Create User Object from req.body
    user = new User({
      name,
      email,
      password,
    });

    //Password Encryption
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //Create User
    await user.save((err, user) => {
      if (err) {
        return res.status(400).json({ err });
      }
      const token =  jwt.sign({user: user.id}, process.env.JWTKEY, { expiresIn: 36000 })

      res.json({ user, token });
    });
 
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};


exports.signin = async (req, res) => {
    try {

        const {email, password} = req.body;

        //user already exist
        let user = await User.findOne({ email });

        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User with that email doesnt exist, Please Sign up' }] });
        }
  

        //password check
       // console.log("PASSWORD: ", password);
       // console.log("USER PASSWORD:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
//        console.log(isMatch);
        if(!isMatch){
            return res.status(400).json({
                errors: [{msg: "Invalid Credentials"}]
            })
        }

        //jwt
        const payload = {
            user: {
              id: user.id
            }
          };
    
          jwt.sign(
            payload,
            process.env.JWTKEY,
            { expiresIn: 36000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token, user });
            }
          );
      
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error")
    }
}


exports.isAuth = (req, res, next) => {
  console.log("PROFILE:", req.auth)
  try {
      let user = req.profile && req.auth && req.profile._id == req.auth._id;
      if (!user){
        return res.status(403).json({
          error: "Access Denied"
        })
      }
      next()

  } catch (error) {
    console.log(error.message);
  }
}

exports.isAdmin = (req, res, next) => {
  try {
      if(req.profile.role === 0){
        return res.status(403).json({
          error: "Admin Resourse, Access Denied"
        })
      }
      next()

  } catch (error) {
    console.log(error.message);
  }
}

