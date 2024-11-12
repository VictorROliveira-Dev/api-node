"use strict";

const ValidationContract = require("../validators/validation");
const repository = require("../repositories/product-repository");
const azure = require("azure-storage");
const guid = require("guid");
const config = require("../config");

exports.get = async (req, res, next) => {
  try {
    var data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar recuperar os produtos.",
    });
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    var data = await repository.getBySlug(req.params.slug);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar recuperar o produto.",
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    var data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar recuperar o produto.",
    });
  }
};

exports.getByTag = async (req, res, next) => {
  try {
    var data = await repository.getByTag(req.params.tag);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar recuperar o produto.",
    });
  }
};

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.title,
    3,
    "O título deve conter pelo menos 3 caracteres."
  );
  contract.hasMinLen(
    req.body.slug,
    8,
    "O slug deve conter pelo menos 8 caracteres."
  );
  contract.hasMinLen(
    req.body.description,
    10,
    "O título deve conter pelo menos 10 caracteres."
  );

  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  try {
    // Cria o blob service
    const blobSvc = azure.createBlobService(config.containerConnectionString);

    let filename = guid.raw().toString() + ".jpg";
    let rawdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer.from(matches[2], "base64");

    // Salva a imagem
    await blobSvc.createBlockBlobFromText(
      "product-images",
      filename,
      buffer,
      {
        contentType: type,
      },
      function (error, result, response) {
        if (error) {
          filename = "default-product.png";
        }
      }
    );

    await repository.create({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      active: true,
      tags: req.body.tags,
      image: "https://nodeapp.blob.core.windows.net/product-images/" + filename,
    });
    res.status(201).send({ message: "Produto cadastrado com sucesso!" });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar cadastrar o produto.",
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await repository.update(req.params.id, req.body);
    res.status(200).send({
      message: "Produto atualizado com sucesso!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição",
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await repository.delete(req.params.id);
    res.status(200).send({
      message: "Produto removido com sucesso.",
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao tentar remover o produto.",
    });
  }
};
