const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const foodPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    foodImage: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
     expiringDate: {
      type: String,  
      required: true,
    },
    pickUpTime: {
      type: String,
      enum: ["13:00h", "13:30h", "14:00", "14:30", "15:00h", "15:30h", "16:00"]
    },
    pickUpPlace: {
      type: String,
      enum: ["Fridge #1", "Fridge #2"]
    },
    foodType: {
      type: String,
      enum: ["omnivore", "vegan", "vegetarian"]
    },
    alergies: {
      type: String,
      required: true,
    },
    requested: {
      type: Boolean,
      default: false
    },

    requestedBy: { type: Schema.Types.ObjectId, ref: "User" },

    creator: { type: Schema.Types.ObjectId, ref: "User" } ///Deleted mongoose. before Schema because it was giving error
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Foodpost = model("Foodpost", foodPostSchema);

module.exports = Foodpost;