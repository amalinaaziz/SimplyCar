const db = require("../models");
const Vehicle = db.vehicles;
const {ObjectID} = require("bson")

const getPagination = (page, itemsPerPage) => {
  const limit = itemsPerPage ? +itemsPerPage : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

// Create and Save a new Vehicle
exports.create = (req, res) => {
  // Validate request
  if (!req.body.brand) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Vehicle
  const vehicle = new Vehicle({
    brand: req.body.brand,
    build: req.body.build,
    year: req.body.year,
    mode: req.body.mode,
    isFeatured: req.body.isFeatured ? req.body.isFeatured : false,
    owner:req.body.owner,
    status: req.body.status ? req.body.status : false,
  });
  console.log('vehicle', vehicle)

  // Save Vehicle in the database
  vehicle
    .save(vehicle)
    .then(() => {
      vehicle.populate('owner', (err, data) => {
        res.send({
          data
        });
      })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating vehicle.",
      });
    });
};

// Retrieve all Vehicles from the database.
exports.findAll = (req, res) => {
  const { page, itemsPerPage, search, sortBy, sortDesc } = req.query;
  let condition = search && search !== 'null'
    ? 
    { "$or": [
        { brand: { $regex: new RegExp(search), $options: "i" }}, 
        { build: { $regex: new RegExp(search), $options: "i" }},
        { year: { $regex: new RegExp(search), $options: "i" }},
        { mode: { $regex: new RegExp(search), $options: "i" }},
    ]}

    : {};

  const { limit, offset } = getPagination(page-1, itemsPerPage);
  const sortDirection = sortDesc === 'true' ? 1 : -1
  const sort = sortBy ? {[sortBy]: sortDirection} : null
  const populate = "owner"

  Vehicle.paginate(condition, { sort, offset, limit, populate })
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
          err.message || "Some error occurred while retrieving vehicles.",
      });
    });
  // console.log('Vehicle.paginate', Vehicle.paginate.toString())
};

// Retrieve all Vehicles from the database.
exports.listAll = (req, res) => {
  let condition = { status: 1 }
  Vehicle.paginate(condition, { })
    .then((data) => {
      res.send({
        data: data.docs
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving vehicles.",
      });
    });
};

// Find a single Vehicle with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Vehicle.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found vehicle with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving vehicle with id=" + id });
    });
};

// Update a Vehicle by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Vehicle.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update vehicle with id=${id}. Maybe vehicle was not found!`,
        });
      } else res.send({ message: "Vehicle was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating vehicle with id=" + id,
      });
    });
};

// Delete a Vehicle with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Vehicle.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete vehicle with id=${id}. Maybe vehicle was not found!`,
        });
      } else {
        res.send({
          message: "Vehicle was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete vehicle with id=" + id,
      });
    });
};

// Delete all Vehicles from the database.
exports.deleteAll = (req, res) => {
  Vehicle.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Vehicles were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all vehicles.",
      });
    });
};

// Find all featured Vehicles
exports.findAllFeatured = (req, res) => {
  const { page, itemsPerPage } = req.query;
  const { limit, offset } = getPagination(page-1, itemsPerPage);

  Vehicle.paginate({ isFeatured: true }, { offset, limit })
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
          err.message || "Some error occurred while retrieving vehicles.",
      });
    });
};
