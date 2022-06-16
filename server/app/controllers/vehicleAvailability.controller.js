const db = require("../models");
const VehicleAvailability = db.vehicleAvailabilities;
const {ObjectID} = require("bson")

const getPagination = (page, itemsPerPage) => {
  const limit = itemsPerPage ? +itemsPerPage : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

// Create and Save a new Availability
exports.create = (req, res) => {
  // Validate request
  if (!req.body.start_at || !req.body.end_at) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Availability
  const vehicleAvailability = new VehicleAvailability({
    start_at: req.body.start_at,
    end_at: req.body.end_at,
    vehicle: req.body.vehicle,
    status: req.body.status ? req.body.status : false,
  });

  // Save Availability in the database
  vehicleAvailability
    .save(vehicleAvailability)
    .then(() => {
      vehicleAvailability.populate('vehicle', (err, data) => {
        res.send({
          data
        });
      })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating availability.",
      });
    });
};

// Retrieve all Availability from the database.
exports.findAll = (req, res) => {
  const { page, itemsPerPage, search, sortBy, sortDesc } = req.query;
  let condition = search && search !== 'null'
    ? 
    { "$or": [
        // { start_at: { $gte: search}}, 
        // { end_at: { $lte: search}}, ,
        // { status: { $regex: new RegExp(search), $options: "i" }}
    ]}

    : {};
    condition = {}

  const { limit, offset } = getPagination(page-1, itemsPerPage);
  const sortDirection = sortDesc === 'true' ? 1 : -1
  const sort = sortBy ? {[sortBy]: sortDirection} : null
  const populate = "vehicle"

  VehicleAvailability.paginate(condition, { sort, offset, limit, populate })
    .then((data) => {
      res.send({
        data: data.docs,
        pagination: {
          total_items: data.totalDocs,
          total_pages: data.total_pages,
          current_page: data.page
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving availability.",
      });
    });
};

// Find a single Availability with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  VehicleAvailability.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found availability with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving availability with id=" + id });
    });
};

// Update a Availability by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  VehicleAvailability.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update availability with id=${id}. Maybe availability was not found!`,
        });
      } else res.send({ message: "Availability was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating availability with id=" + id,
      });
    });
};

// Delete a Availability with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  VehicleAvailability.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete availability with id=${id}. Maybe availability was not found!`,
        });
      } else {
        res.send({
          message: "Availability was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete availability with id=" + id,
      });
    });
};

// Delete all Availability from the database.
exports.deleteAll = (req, res) => {
  VehicleAvailability.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Availability were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all availability.",
      });
    });
};

// Find all featured Availability
exports.findAllFeatured = (req, res) => {
  const { page, itemsPerPage } = req.query;
  const { limit, offset } = getPagination(page-1, itemsPerPage);

  VehicleAvailability.paginate({ isFeatured: true }, { offset, limit })
    .then((data) => {
      res.send({
        data: data.docs,
        pagination: {
          total_items: data.totalDocs,
          total_pages: data.total_pages,
          current_page: data.page
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving availability.",
      });
    });
};
