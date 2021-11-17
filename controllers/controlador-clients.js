const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const { validationResult } = require("express-validator");
const Client = require("../models/client");

// create new client
const createNewClient = async (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const error = new Error("Validation Error. Check the datas.");
    error.code = 422;
    return next(error);
  }
  const {
    clientName,
    clientEmail,
    clientStreet,
    clientCity,
    clientPostCode,
    clientCountry,
  } = req.body;
  let existeClient;
  try {
    existeClient = await Client.findOne({
      clientEmail: clientEmail,
    });
  } catch (err) {
    const error = new Error("There was an error with the operation.");
    error.code = 500;
    return next(error);
  }
  if (existeClient) {
    const error = new Error("A client already exists with this e-mail.");
    error.code = 401;
    return next(error);
  } else {
    const nuevoClient = new Client({
      clientName: clientName,
      clientEmail: clientEmail,
      clientStreet: clientStreet,
      clientCity: clientCity,
      clientPostCode: clientPostCode,
      clientCountry: clientCountry,
    });
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await nuevoClient.save({
        session: sess,
      });
      await sess.commitTransaction();
    } catch (err) {
      const error = new Error("The data could not be saved.");
      error.code = 500;
      return next(error);
    }
    res.status(201).json({
      client: nuevoClient,
    });
  }
};

// recuperar todos los clients
const getAllClients = async (req, res, next) => {
  let clients;
  try {
    clients = await Client.find().populate(["invoices"]);
  } catch (err) {
    const error = new Error("Validation Error. Check the datas.");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    clients: clients,
  });
};

// consulta client por su id
const getClientById = async (req, res, next) => {
  const idClient = req.params.id;
  let client;
  try {
    client = await Client.findById(idClient);
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to recover the datas."
    );
    error.code = 500;
    return next(error);
  }
  if (!client) {
    const error = new Error(
      "It was not possible to recover a client with the given id"
    );
    error.code = 404;
    return next(error);
  }
  res.json({
    client: client,
  });
};

// modificar client por id
const modifyClientById = async (req, res, next) => {
  const idClient = req.params.id;
  let client;
  try {
    client = await Client.findById(idClient);
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to update the datas."
    );
    error.code = 500;
    return next(error);
  }
  client = Object.assign(client, req.body);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await client.save({
      session: sess,
    });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to save the updated datas."
    );
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    client,
  });
};

// delete client by id
const deleteClientById = async (req, res, next) => {
  const idClient = req.params.id;
  let client;
  try {
    client = await Client.findById(idClient);
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to recover the datas for deleting."
    );
    error.code = 500;
    return next(error);
  }
  if (!client) {
    const error = new Error(
      "It was not possible to recover a client with the given id"
    );
    error.code = 404;
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await client.remove({
      session: sess,
    });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to delete the datas."
    );
    error.code = 500;
    return next(error);
  }
  res.json({
    message: "Client deleted.",
  });
};

exports.createNewClient = createNewClient;
exports.getAllClients = getAllClients;
exports.getClientById = getClientById;
exports.modifyClientById = modifyClientById;
exports.deleteClientById = deleteClientById;
