const db = require("../models");
const User = db.users;
const {ObjectID} = require("bson")

const getPagination = (page, itemsPerPage) => {
  const limit = itemsPerPage ? +itemsPerPage : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a User
  const user = new User({
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    status: req.body.status ? req.body.status : false,
  });

  // Save User in the database
  user
    .save(user)
    .then((data) => {
      res.send({
        data
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating user.",
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const { page, itemsPerPage, search, sortBy, sortDesc } = req.query;
  let condition = search && search !== 'null'
    ? 
    { "$or": [
        { email: { $regex: new RegExp(search), $options: "i" }}, 
        { first_name: { $regex: new RegExp(search), $options: "i" }},
        { last_name: { $regex: new RegExp(search), $options: "i" }}
    ]}

    : {};

  const { limit, offset } = getPagination(page-1, itemsPerPage);
  const sortDirection = sortDesc === 'true' ? 1 : -1
  const sort = sortBy ? {[sortBy]: sortDirection} : null

  User.paginate(condition, { sort, offset, limit })
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
          err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Retrieve all Users from the database.
exports.listAll = (req, res) => {
  let condition = { status: 1 }
  User.paginate(condition, { })
    .then((data) => {
      res.send({
        data: data.docs
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found user with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving user with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with id=${id}. Maybe user was not found!`,
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`,
        });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id=" + id,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users.",
      });
    });
};

// Find all featured Users
exports.findAllFeatured = (req, res) => {
  const { page, itemsPerPage } = req.query;
  const { limit, offset } = getPagination(page-1, itemsPerPage);

  User.paginate({ isFeatured: true }, { offset, limit })
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
          err.message || "Some error occurred while retrieving users.",
      });
    });
};
