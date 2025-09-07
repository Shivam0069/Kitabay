import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    book: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Reference to Book model
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    fine: {
      type: Number,
      default: 0,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
