const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.SECRET, { expiresIn: "3d" });
};

// login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, email);

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (error) {
    if (error.name == "IncorrectPassword" || error.name == "AccountNotExist") {
      res.status(200).json({ errorUser: error.message });
    } else {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
};

// sign up

const signUpUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await User.signup(firstname, lastname, email, password);
    const token = createToken(user._id, email);

    res.status(200).json({
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      token,
    });
  } catch (error) {
    if (error.name == "EmailExist") {
      res.status(200).json({ errorUser: error.message });
    } else {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
};

const verifyUser = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    res.status(200).json({ userValid: true });
  } catch (error) {
    res.status(401).json({ userValid: false });
  }
};

module.exports = { signUpUser, loginUser, verifyUser };
