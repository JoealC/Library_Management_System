import mongoose from "mongoose";
import Joi, { string } from "joi";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 200,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 200,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 200,
    },
    is_Blocked: Boolean,
    status:{
        type:Number,
        default: 1,
      },
      user_Type:{
        type: String,
      },
      
    },
    {timestamps: true});

    const User = mongoose.model('User', userSchema)

    function validateUser(user){
        const schema = Joi.object({
            username: Joi.string().min(3).max(200).required(),
            email:Joi.string().email().min(5).max(255).required(),
            password: Joi.string().min(6).max(200).required(),
            user_Type:Joi.string()
        })
        return schema.validate(user)
    }

    export {User, validateUser}