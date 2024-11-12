"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Criando o Model
// Obs: o ID é gerado automaticamente pelo schema (GUID por padrão)
const schema = new Schema({
  title: {
    type: String,
    required: [true, "O Nome é obrigatório."],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "O slug é obrigatório."],
    trim: true,
    index: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "A descrição é obrigatória."],
  },
  price: {
    type: Number,
    required: [true, "O preço é obrigatório."],
  },
  active: {
    type: Boolean,
    required: [true, "O estado é obrigatório."],
    default: true,
  },
  tags: [
    {
      type: String,
      required: [true, "A(as) tags são obrigatórias."],
    },
  ],
  image: {
    type: String,
    required: true,
    trim: true,
  },
});

// Exportando e nomeando Model
module.exports = mongoose.model("Produto", schema);
