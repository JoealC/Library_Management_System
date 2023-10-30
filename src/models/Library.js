import mongoose from 'mongoose';
import Joi from 'joi';

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  librarian:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Librarian',
    required: true,
  },
  status:{
    type:Number,
    default: 1,
  }
  
},
{timestamps: true});

const Library = mongoose.model('Library', librarySchema);

function validateLibrary(library) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    librarian: Joi.string().required(), 
  });

  return schema.validate(library);
}

export { Library, validateLibrary };