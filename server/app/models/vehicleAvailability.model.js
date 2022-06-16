module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      start_at: mongoose.Schema.Types.String,
      end_at: mongoose.Schema.Types.String,
      vehicle: {
        type: mongoose.Schema.Types.ObjectId, ref: "vehicle"
      },
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

  const VehicleAvailability = mongoose.model("vehicleAvailability", schema);
  return VehicleAvailability;
};
