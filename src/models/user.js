const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./tasks");
const mongoosePaginate = require("mongoose-paginate-v2");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is invalid");
      },
    },
    age: {
      type: Number,
      required: true,
      default: 19,
      validate(value) {
        if (value < 18) throw new Error("Age should be greater than 18");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value === "password")
          throw new Error('Password does`t containe "password"');
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "user_id",
});

//Generate a Authentication token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_TOKEN || "skytalawar"
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findBycredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable To login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//hide the private data like all tokens,password etc..
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

//Hash The plain password
userSchema.pre("save", async function (next) {
  const user = this;
  // console.log(user);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//Delete all task when user get delete
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ user_id: user._id });

  next();
});

userSchema.plugin(mongoosePaginate);
const User = mongoose.model("Users", userSchema);

module.exports = User;
