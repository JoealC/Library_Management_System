import Joi from "joi";
import { idValidator } from "./param-validator";
import { errorResponse } from "../middleware/response";

const librarianValidation = Joi.object({
    username: Joi.string().min(3).max(200).required(),
    password: Joi.string().min(6).max(200).required(),
    email:Joi.string().email().min(5).max(255).required(),
})

export const librarianRegisterValidator = (req, res, next) => {
    try{
        const {error} = librarianValidation.validate(req.body)
        if(error){
            return errorResponse(res, 400, {error: error.details[0].message})
        }
        next()
    }catch(err){
        console.log(err)
        errorResponse(res, 500, "Internal Server Error")
    }
}

export const librarianUpdateValidator = (req, res, next)=>{
    try{
        const {error} = adminValidation.validate(req.body)
        if(error){
            return errorResponse(res, 400, {error: error.details[0].message})
        }
        next()
    }catch(err){
        console.log(err)
        errorResponse(res, 500, "Internal Server Error")
    }
}

export const librarianIdValidator = async(req, res, next) => {
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