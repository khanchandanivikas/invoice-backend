const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const controladorClients = require("../controllers/controlador-clients");

// create new client
router.post(
  "/",
  [
    check("clientName").not().isEmpty(),
    check("clientEmail").not().isEmpty(),
    check("clientStreet").not().isEmpty(),
    check("clientCity").not().isEmpty(),
    check("clientPostCode").not().isEmpty(),
    check("clientCountry").not().isEmpty(),
    check("clientEmail").normalizeEmail().isEmail(),
    check("clientPostCode").isNumeric(),
  ],
  controladorClients.createNewClient
);

// consulta todos los clientes
router.get("/", controladorClients.getAllClients);

// consulta client por su id
router.get("/:id", controladorClients.getClientById);

// modificar client por id
router.patch("/:id", controladorClients.modifyClientById);

// delete client by id
router.delete("/:id", controladorClients.deleteClientById);

module.exports = router;
