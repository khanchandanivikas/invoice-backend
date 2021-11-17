const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const { validationResult } = require("express-validator");
const Invoice = require("../models/invoice");
const Client = require("../models/client");

// create new invoice
const createNewInvoice = async (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const error = new Error("Validation Error. Check the datas.");
    error.code = 422;
    return next(error);
  }
  const {
    status,
    senderStreet,
    senderCity,
    senderPostCode,
    senderCountry,
    createdAt,
    paymentDue,
    paymentTerms,
    description,
    items,
    totalBill,
    clientName,
    clientEmail,
    clientStreet,
    clientCity,
    clientPostCode,
    clientCountry,
    client,
  } = req.body;
  let existeClient;
  try {
    existeClient = await Client.findOne({
      clientEmail: clientEmail,
    }).populate(["invoices"]);
  } catch (err) {
    const error = new Error("There was an error with the operation.");
    error.code = 500;
    return next(error);
  }
  if (!existeClient) {
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
    let createdClient;
    try {
      createdClient = await Client.findById(nuevoClient.id).populate([
        "invoices",
      ]);
    } catch (err) {
      const error = new Error("There was an error with the operation.");
      error.code = 500;
      return next(error);
    }
    const nuevoInvoice = new Invoice({
      status: status,
      senderStreet: senderStreet,
      senderCity: senderCity,
      senderPostCode: senderPostCode,
      senderCountry: senderCountry,
      createdAt: createdAt,
      paymentDue: paymentDue,
      paymentTerms: paymentTerms,
      description: description,
      items: items,
      totalBill: totalBill,
      client: nuevoClient.id,
    });
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await nuevoInvoice.save({
        session: sess,
      });
      createdClient.invoices.push(nuevoInvoice);
      await createdClient.save({
        session: sess,
      });
      await sess.commitTransaction();
    } catch (err) {
      const error = new Error("The data could not be saved.");
      error.code = 500;
      return next(error);
    }
    res.status(201).json({
      invoice: nuevoInvoice,
    });
  } else {
    const nuevoInvoice = new Invoice({
      status: status,
      senderStreet: senderStreet,
      senderCity: senderCity,
      senderPostCode: senderPostCode,
      senderCountry: senderCountry,
      createdAt: createdAt,
      paymentDue: paymentDue,
      paymentTerms: paymentTerms,
      description: description,
      items: items,
      totalBill: totalBill,
      client: existeClient.id,
    });
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await nuevoInvoice.save({
        session: sess,
      });
      existeClient.invoices.push(nuevoInvoice);
      await existeClient.save({
        session: sess,
      });
      await sess.commitTransaction();
    } catch (err) {
      const error = new Error("The data could not be saved.");
      console.log(err);
      error.code = 500;
      return next(error);
    }
    res.status(201).json({
      invoice: nuevoInvoice,
    });
  }
};

// recuperar todos los invoices
const getAllInvoices = async (req, res, next) => {
  let invoices;
  try {
    invoices = await Invoice.find().populate(["client"]);
  } catch (err) {
    const error = new Error("Validation Error. Check the datas.");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    invoices: invoices,
  });
};

// consulta invoice por su id
const getInvoiceById = async (req, res, next) => {
  const idInvoice = req.params.id;
  let invoice;
  try {
    invoice = await (await Invoice.findById(idInvoice)).populate("client");
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to recover the datas."
    );
    error.code = 500;
    return next(error);
  }
  if (!invoice) {
    const error = new Error(
      "It was not possible to recover an invoice with the given id"
    );
    error.code = 404;
    return next(error);
  }
  res.json({
    invoice: invoice,
  });
};

// modificar invoice por id
const modifyInvoiceById = async (req, res, next) => {
  const idInvoice = req.params.id;
  let invoice;
  try {
    invoice = await Invoice.findById(idInvoice);
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to update the datas."
    );
    error.code = 500;
    return next(error);
  }
  invoice = Object.assign(invoice, req.body);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await invoice.save({
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
    invoice,
  });
};

// delete invoice by id
const deleteInvoiceById = async (req, res, next) => {
  const idInvoice = req.params.id;
  let invoice;
  try {
    invoice = await Invoice.findById(idInvoice).populate("client");
  } catch (err) {
    const error = new Error(
      "There was some error. It was not possible to recover the datas for deleting."
    );
    error.code = 500;
    return next(error);
  }
  if (!invoice) {
    const error = new Error(
      "It was not possible to recover an invoice with the given id"
    );
    error.code = 404;
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    invoice.client.invoices.pull(invoice);
    await invoice.remove({
      session: sess,
    });
    await invoice.client.save({
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
    message: "Invoice deleted.",
  });
};

exports.createNewInvoice = createNewInvoice;
exports.getAllInvoices = getAllInvoices;
exports.getInvoiceById = getInvoiceById;
exports.modifyInvoiceById = modifyInvoiceById;
exports.deleteInvoiceById = deleteInvoiceById;
