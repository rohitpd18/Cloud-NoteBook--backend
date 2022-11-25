const mongoose = require("mongoose");

// mongoose schema for create new user
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

//  creating User model form userschema
const User = mongoose.model("user", UserSchema);
module.exports = User;
