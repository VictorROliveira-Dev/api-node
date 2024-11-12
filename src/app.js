"use strict";

const express = require("express");
// Pacote para conversão de dados para json
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config");

const app = express();
const router = express.Router();

// Conectando ao banco
mongoose.connect(config.connectionString);

// Carrega as models
const Product = require("./models/product");
const Customer = require("./models/customer");
const Order = require("./models/order");

// Carregar as rotas
const indexRoute = require("./routes/index-route");
const productRoute = require("./routes/product-route");
const customerRoute = require("./routes/customer-route");
const orderRoute = require("./routes/order-route");

// Convertendo
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

// Habilita o CORS
// Para poder fazer requisições localhost
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Origin",
    "Origin. X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use("/", indexRoute);
app.use("/products", productRoute);
app.use("/customers", customerRoute);
app.use("/orders", orderRoute);

module.exports = app;
