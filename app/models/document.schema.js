var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//document schema for database
var documentSchema = new Schema({
  ownerId: {
    type: Schema.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    unique: true,
    required: true
  },
  content: {
    type: String,
    required: true
  },

  date_created: Date,

  last_modified: Date

});

documentSchema.pre('save', function(next) {
  var file = this;
  var currentDate = new Date();

  file.last_modified = currentDate;
  if(!file.date_created) {
    file.date_created = currentDate;
  }
  next();
});

mongoose.model('Document', documentSchema);