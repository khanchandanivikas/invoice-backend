const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const controladorInvoices = require("../controllers/controlador-invoices");

// create new invoice
router.post(
  "/",
  [
    check("status").not().isEmpty(),
    check("senderStreet").not().isEmpty(),
    check("senderCity").not().isEmpty(),
    check("senderPostCode").not().isEmpty(),
    check("senderCountry").not().isEmpty(),
    check("paymentDue").not().isEmpty(),
    check("paymentTerms").not().isEmpty(),
    check("description").not().isEmpty(),
    check("items").not().isEmpty(),
    check("totalBill").not().isEmpty(),
    check("senderPostCode").isNumeric(),
    check("totalBill").isNumeric(),
  ],
  controladorInvoices.createNewInvoice
);

// consulta todos los invoices
router.get("/", controladorInvoices.getAllInvoices);

// consulta paid invoices
router.get("/:status", controladorInvoices.getStatusInvoices);

// consulta invoice por su id
router.get("/:id", controladorInvoices.getInvoiceById);

// modificar invoice por id
router.patch("/:id", controladorInvoices.modifyInvoiceById);

// delete invoice by id
router.delete("/:id", controladorInvoices.deleteInvoiceById);

module.exports = router;