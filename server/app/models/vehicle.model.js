module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      brand: mongoose.Schema.Types.String,
      build: mongoose.Schema.Types.String,
      year: mongoose.Schema.Types.String,
      mode: mongoose.Schema.Types.String,
      isFeatured: mongoose.Schema.Types.Boolean, default: false,
      owner: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
      availabilites: [{
        type: mongoose.Schema.Types.ObjectId, ref: "vehicleAvailability"
      }],
      status: mongoose.Schema.Types.Number
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const Vehicle = mongoose.model("vehicle", schema);
  return Vehicle;
};
