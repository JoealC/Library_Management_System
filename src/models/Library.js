import { array, string } from 'joi';
import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  librarian:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Librarian',
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

const Library = mongoose.model('Library', librarySchema)
export { Library }

// function validateLibrary(library) {
//   console.log(library)
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(255),
//     librarian: Joi.string(), 
//   });

//   return schema.validate(library);
// }

