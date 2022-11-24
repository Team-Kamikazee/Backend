import mongoose from 'mongoose';

const ExpenditureSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
    photo: [String]
});

const Expenditure = mongoose.model('Expenditure', ExpenditureSchema);

export default Expenditure;
