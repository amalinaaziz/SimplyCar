module.exports = app => {
  const vehicleAvailabilities = require("../controllers/vehicleAvailability.controller.js");

  var router = require("express").Router();

  // Create a new vehicleAvailabilities
  router.post("/", vehicleAvailabilities.create);

  // Retrieve all vehicleAvailabilities
  router.get("/", vehicleAvailabilities.findAll);

  // Retrieve a single vehicleAvailabilities with id
  router.get("/:id", vehicleAvailabilities.findOne);

  // Update a vehicleAvailabilities with id
  router.put("/:id", vehicleAvailabilities.update);

  // Delete a vehicleAvailabilities with id
  router.delete("/:id", vehicleAvailabilities.delete);

  // Create a new vehicleAvailabilities
  router.delete("/", vehicleAvailabilities.deleteAll);

  app.use("/api/vehicle-availabilities", router);
};
