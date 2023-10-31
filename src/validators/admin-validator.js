import Joi from "joi";
import { idValidator } from "./param-validator";
import { response } from "express";
import { errorResponse } from "../middleware/response";

const adminValidation = Joi.object({
    username: Joi.string().min(3).max(200).required(),
    password: Joi.string().min(6).max(200).required(),
    email:Joi.string().email().min(5).max(255).required(),
})

export const registerValidator = (req, res, next) => {
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

export const UpdateValidator = (req, res, next)=>{
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

export const deleteValidator = async(req, res, next) => {
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

export const adminAddLibrarianValidator = (req, res, next)=>{
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

export const adminEditLibrarianValidator = (req, res, next)=>{
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

export const adminLibrarianIdValidator = async(req, res, next) => {
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



