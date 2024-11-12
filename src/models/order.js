"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
  },
  number: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["create", "done"],
    default: "create",
  },
  items: [
    {
      quantity: {
        type: Number,
        require: true,
        default: 1,
      },
      price: {
        type: Number,
        require: true,
      },
      produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto",
      },
    },
  ],
});

// Exportando e nomeando Model
module.exports = mongoose.model("Pedidos", schema);
