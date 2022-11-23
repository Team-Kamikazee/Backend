import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  className: {
    type: String,
    unique: true,
  },
  subjects: {
    type: Array,
  },
});

const Class = mongoose.model('Class', ClassSchema);

export default Class;
