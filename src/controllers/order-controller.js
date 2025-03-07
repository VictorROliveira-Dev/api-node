"use strict";

const repository = require("../repositories/order-repository");
const guid = require("guid");
const authService = require("../services/auth-service");

exports.get = async (req, res, next) => {
  try {
    var data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar recuperar os pedidos.",
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    // Recuperando o token
    var token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    // Decodificando o token
    var data = await authService.decodeToken(token);

    await repository.create({
      customer: data.id,
      number: guid.raw().substring(0, 6),
      items: req.body.items,
    });
    res.status(201).send({ message: "Pedido criado com sucesso!" });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar criar o pedido",
    });
  }
};
