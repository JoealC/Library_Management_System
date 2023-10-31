import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 20,
  },
  category: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  copies: {
    type: Number,
    min: 1,
    max: 1000, 
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000, 
  },
  images: [{
    type: String,
  }],
  status:{
    type:Number,
    default: 1,
  },
  created_at:{
    type: Date,
    default: Date.now()
  }
},
  {timestamps: true});

const Book = mongoose.model('Book', bookSchema)
export { Book }

// function validateBook(book) {
//   const schema = Joi.object({
//     title: Joi.string().min(1).max(255).required(),
//     author: Joi.string().min(1).max(255).required(),
//     ISBN: Joi.string().min(10).max(20).required(),
//     category: Joi.string().min(1).max(255).required(),
//     copies: Joi.number().min(1).max(1000).required(),
//     description: Joi.string().min(1).max(1000).required(),
//     user_Type: Joi.string()
//     images: Joi.array().items(Joi.string()),
//   });
//   return schema.validate(book);
// }

