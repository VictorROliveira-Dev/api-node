"use strict";

const mongoose = require("mongoose");
const Product = mongoose.model("Produto");

exports.get = async () => {
  // Escolhendo quais produtos procurar (os que estiver ativos) e os campos que deseja exibir
  const res = await Product.find(
    {
      active: true,
    },
    "title price slug"
  );
  return res;
};

exports.getBySlug = async (slug) => {
  // Escolhendo produtos através do slug
  const res = await Product.find(
    { slug: slug, active: true },
    "title description price slug tags"
  );
  return res;
};

exports.getById = async (id) => {
  // Escolhendo produtos através do id
  const res = await Product.findById(id);
  return res;
};

exports.getByTag = async (tag) => {
  // Escolhendo produtos através da tag
  const res = await Product.find(
    { tags: tag, active: true },
    "title description price slug tags"
  );
  return res;
};

exports.create = async (body) => {
  var product = new Product(body);
  await product.save();
};

exports.update = async (id, data) => {
  await Product.findByIdAndUpdate(id, {
    $set: {
      title: data.title,
      description: data.description,
      price: data.price,
      slug: data.slug,
    },
  });
};

exports.delete = async (id) => {
  await Product.findOneAndDelete(id);
};
