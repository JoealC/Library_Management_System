import Joi from "joi"

const loginValidation = Joi.object({
    email:Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(6).max(200).required(),
})

export const loginValidator = (req, res, next) => {
    try{
        const {error} = loginValidation.validate(req.body)
        if(error){
            return errorResponse(res, 400, {error: error.details[0].message})
        }
        next()
    }catch(err){
        console.log(err)
        errorResponse(res, 500, "Internal Server Error")
    }
}