import mongoose from 'mongoose';

const borrowingSchema = new mongoose.Schema({
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  book: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', 
    required: true,
  }],
  due_Date: {
    type: Date,
  },
  returned: {
    type: Boolean,
    default: false,
  },
  status:{
    type:Number,
    default: 1,
  },
  created_at:{
    type: Date,
    default: Date.now()
  }
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);
export { Borrowing }
// function validateBorrowing(borrowing) {
//   const schema = Joi.object({
//     user: Joi.string().required(), 
//     book: Joi.string().required(), 
//     dueDate: Joi.date(),
//     returned: Joi.boolean(),
//   });

//   return schema.validate(borrowing);
// }

