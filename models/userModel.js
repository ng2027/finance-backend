const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password
) {
  const accountExist = await this.findOne({ email });

  if (accountExist) {
    throw { name: "EmailExist", message: "Email already in use." };
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  const userExist = await this.findOne({ email });

  if (!userExist) {
    throw {
      name: "AccountNotExist",
      message: "An account does not exist with this email.",
    };
  }

  const match = await bcrypt.compare(password, userExist.password);

  if (!match) {
    throw {
      name: "IncorrectPassword",
      message: "Incorrect Password",
    };
  }

  return userExist;
};

module.exports = mongoose.model("User", userSchema);
