import { idValidator } from "./param-validator"

export const userIdValidator = async(req, res, next) => {
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