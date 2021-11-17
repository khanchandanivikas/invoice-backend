const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
    unique: true,
  },
  clientStreet: {
    type: String,
    required: true,
  },
  clientCity: {
    type: String,
    required: true,
  },
  clientPostCode: {
    type: Number,
    required: true,
  },
  clientCountry: {
    type: String,
    required: true,
  },
  invoices: [{
    type: mongoose.Types.ObjectId,
    ref: "Invoice",
    default: [],
  }],
});

clientSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Client", clientSchema);
