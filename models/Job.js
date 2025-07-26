const { required } = require("joi");
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position applied to"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "pending", "declined"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide creator name"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
