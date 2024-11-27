const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      minlength: [
        3,
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      ],
      maxlength: [
        50,
        "Le nom d'utilisateur ne doit pas dépasser 50 caractères",
      ],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "L'événement associé est requis"],
    },
    organisateur: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'organisateur de l'événement est requis"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email required"],
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone is required"],
    },
    registered_at: {
      type: Date,
      default: Date.now,
    },
    imgProfile: {
      type: Object,
      default: {
        url: "https://www.w3schools.com/w3images/avatar2.png",
        id: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
