import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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

    const Admin = mongoose.model('Admin', adminSchema)
    export {Admin}

    // function validateAdmin(admin){
    //     const schema = Joi.object({
    //         username: Joi.string().min(3).max(200).required(),
    //         password: Joi.string().min(6).max(200).required(),
    //         email:Joi.string().email().min(5).max(255).required(),
    //         user_Type: Joi.string()
    //     })
    //     return schema.validate(admin)
    // }

    