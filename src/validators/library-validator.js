import Joi from "joi";
import { errorResponse } from "../middleware/response";
import { idValidator } from "./param-validator";

const libraryValidator = Joi.object({
    name: Joi.string().min(3).max(255),
    librarian: Joi.array(),
})

export const createLibraryValidator = (req, res, next) => {
    try{
        const {error} = libraryValidator.validate(req.body)
        if(error){
            return errorResponse(res, 400, {error: error.details[0].message})
        }
        next()
    }catch(err){
        console.error(err)
        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const libraryIdValidator = async(req, res, next) => {
    try{
        if((await idValidator(req.params.libraryId)) == true){
            next()
        }else{
            return errorResponse(res, 400, "Invalid class ID")
        }
    }catch(err){
        console.log(err)
        errorResponse(res, 500, "Internal Server Error")
    }
}