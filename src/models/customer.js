"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Criando o Model
// Obs: o ID é gerado automaticamente pelo schema (GUID por padrão)
const schema = new Schema({
  name: {
    type: String,
    required: [true, "O Nome é obrigatório."],
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "admin",
    },
  ],
});

// Exportando e nomeando Model
module.exports = mongoose.model("Cliente", schema);
