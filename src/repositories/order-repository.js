"use strict";

const mongoose = require("mongoose");
const Order = mongoose.model("Pedidos");

exports.get = async () => {
  const res = await Order.find({}, "number status").populate("items.produto", "title");
  return res;
};

exports.create = async (data) => {
  var order = new Order(data);
  await order.save();
};
