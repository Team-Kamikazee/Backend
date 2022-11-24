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
  photo: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
  vendorName: {
    type: String,
  },
  uuid: {
    type: String,
  },
});

const Expenditure = mongoose.model('Expenditure', ExpenditureSchema);

export default Expenditure;
