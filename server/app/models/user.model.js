module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      email: String,
      first_name: String,
      last_name: String,
      vehicles: [{
        type: mongoose.Schema.Types.ObjectId, ref: "vehicle"
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

  const User = mongoose.model("user", schema);
  return User;
};
