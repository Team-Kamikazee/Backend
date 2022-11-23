import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  subjectName: {
    type: String,
    unique: true,
  },
});

const Subject = mongoose.model('Subject', SubjectSchema);

export default Subject;
