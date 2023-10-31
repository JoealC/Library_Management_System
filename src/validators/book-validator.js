import Joi from "joi";
import { idValidator } from "./param-validator";
import { errorResponse } from "../middleware/response";

const bookValidation = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        author: Joi.string().min(1).max(255).required(),
        ISBN: Joi.string().min(10).max(20).required(),
        category: Joi.string().min(1).max(255).required(),
        copies: Joi.number().min(1).max(1000).required(),
        description: Joi.string().min(1).max(1000).required(),
        user_Type: Joi.string(),
        images: Joi.array().items(Joi.string()),
})

export const bookValidator = (req, res, next) => {
    try{
        const {error} = bookValidation.validate(req.body)
        if(error){
            return errorResponse(res, 400, {error: error.details[0].message})
        }
        next()
    }catch(err){
        console.log(err)
        errorResponse(res, 500, "Internal Server Error")
    }
}

export const bookIdValidator = async(req, res, next) => {
    try{
        if((await idValidator(req.params.id)) == true){
            next()
        }else{
            return errorResponse(res, 400, "Invalid class ID")
        }
    }catch(err){
        console.log(err)
        errorResponse(res, 500, "Internal Server Error")
    }
}