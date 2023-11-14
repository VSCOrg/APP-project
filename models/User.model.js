const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    foodPosts: [{ type: Schema.Types.ObjectId, ref: "Foodpost" }],
    // Put-->update user con bio profile pic
    bio: {
      type: String,
      default: " ",
    },
    profilePicture: {
      type: String,
      default: "./public/images/cook.png",
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
