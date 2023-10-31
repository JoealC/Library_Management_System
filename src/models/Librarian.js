import mongoose from "mongoose";

const librarianSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 200,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 200,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 200,
    },
    is_Blocked:Boolean,
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

    const Librarian = mongoose.model('Librarian', librarianSchema)
    export { Librarian }

    // function validateLibrarian(librarian){
    //     const schema = Joi.object({
    //         username: Joi.string().min(3).max(200),
    //         password: Joi.string().min(6).max(200),
    //         email:Joi.string().email().min(5).max(255),
    //         user_Type:Joi.string(),
    //     })
    //     return schema.validate(librarian)
    // }

    