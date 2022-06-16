module.exports = app => {
  const vehicles = require("../controllers/vehicle.controller.js");

  var router = require("express").Router();

  // Create a new vehicle
  router.post("/", vehicles.create);

  // Retrieve all vehicles
  router.get("/", vehicles.findAll);

  // Retrieve all vehicles
  router.get("/all", vehicles.listAll);

  // Retrieve all featured vehicles
  router.get("/featured", vehicles.findAllFeatured);

  // Retrieve a single vehicle with id
  router.get("/:id", vehicles.findOne);

  // Update a vehicle with id
  router.put("/:id", vehicles.update);

  // Delete a vehicle with id
  router.delete("/:id", vehicles.delete);

  // Create a new vehicle
  router.delete("/", vehicles.deleteAll);

  app.use("/api/vehicles", router);
};
