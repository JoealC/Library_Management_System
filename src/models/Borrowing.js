import mongoose from 'mongoose';
import Joi from 'joi';

const borrowingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', 
    required: true,
  },
  due_Date: {
    type: Date,
  },
  returned: {
    type: Boolean,
    default: false,
  },
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

function validateBorrowing(borrowing) {
  const schema = Joi.object({
    user: Joi.string().required(), 
    book: Joi.string().required(), 
    dueDate: Joi.date(),
    returned: Joi.boolean(),
  });

  return schema.validate(borrowing);
}

export { Borrowing, validateBorrowing };