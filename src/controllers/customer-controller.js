"use strict";

const ValidationContract = require("../validators/validation");
const repository = require("../repositories/customer-repository");
const md5 = require("md5");
const authService = require("../services/auth-service");

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.name,
    3,
    "O nome deve conter pelo menos 3 caracteres."
  );
  contract.isEmail(req.body.email, "E-mail inválido.");
  contract.hasMinLen(
    req.body.password,
    8,
    "A senha deve conter pelo menos 9 caracteres."
  );

  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  try {
    await repository.create({
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY),
      roles: req.body.roles,
    });
    res.status(201).send({ message: "Cliente cadastrado com sucesso!" });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar cadastrar o cliente.",
    });
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const customer = await repository.authenticate({
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY),
    });

    if (!customer) {
      res.status(404).send({
        message: "Usuário ou senha inválidos.",
      });
      return;
    }

    const token = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles
    });

    res.status(201).send({
      message: "Usuário autênticado com sucesso!",
      token: token,
      data: {
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar autorizar o usuário.",
    });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    // Recuperando o token
    var token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    // Decodificando o token
    var data = await authService.decodeToken(token);

    const customer = await repository.getById(data.id);

    if (!customer) {
      res.status(404).send({
        message: "Cliente não encontrado.",
      });
      return;
    }

    const tokenData = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles
    });

    res.status(201).send({
      message: "Usuário autênticado novamente com sucesso!",
      token: token,
      data: {
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar atualizar o token do cliente.",
    });
  }
};
