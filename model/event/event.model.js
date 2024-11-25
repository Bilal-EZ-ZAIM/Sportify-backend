const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Le nom de l'événement est requis"],
      minlength: [
        3,
        "Le nom de l'événement doit contenir au moins 3 caractères",
      ],
      maxlength: [
        100,
        "Le nom de l'événement ne doit pas dépasser 100 caractères",
      ],
    },
    description: {
      type: String,
      required: [true, "La description de l'événement est requise"],
      minlength: [10, "La description doit contenir au moins 10 caractères"],
      maxlength: [500, "La description ne doit pas dépasser 500 caractères"],
    },
    organisateur: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'organisateur de l'événement est requis"],
    },
    price: {
      type: Number,
      required: [true, "Le prix de l'événement est requis"],
      min: [0, "Le prix ne peut pas être inférieur à 0"],
    },
    participants: {
      type: Number,
      required: [true, "Le participants de l'événement est requis"],
    },
    location: {
      type: String,
      required: [true, "Le lieu de l'événement est requis"],
    },
    date: {
      type: Date,
      required: [true, "La date de l'événement est requise"],
      validate: {
        validator: function (value) {
          return value >= Date.now();
        },
        message: "La date doit être dans le futur",
      },
    },
    event_image: {
      type: Object,
      default: {
        url: `https://images.unsplash.com/photo-1569863959165-56dae551d4fc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        id: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
