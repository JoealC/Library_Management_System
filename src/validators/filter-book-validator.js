import Joi from "joi";
import { idValidator } from "./param-validator";
import { errorResponse } from "../middleware/response";

const filterBookValidation = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        author: Joi.string().min(1).max(255).required(),
        category: Joi.string().min(1).max(255).required(),
})

export const filterBookValidator = (req, res, next)=>{
    try{
        const {error} = filterBookValidation.validate(req.body)
        if(error){
            return errorResponse(res, 400, {error: error.details[0].message})
        }
        next()
    }catch(err){
        console.log(err)
        errorResponse(res, 500, "Internal Server Error")
    }
}