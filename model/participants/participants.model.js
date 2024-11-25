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
    price: {
      type: Number,
      required: [true, "Le prix du ticket est requis"],
      min: [0, "Le prix ne peut pas être inférieur à 0"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "L'événement associé est requis"],
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
    payment_status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      required: [true, "Le statut du paiement est requis"],
    },
  },
  {
    timestamps: true,
  }
);

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
