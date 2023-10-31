import mongoose from "mongoose";

export const idValidator = (id) => {
    return new Promise((resolve, reject) => {
        if(mongoose.Types.ObjectId.isValid(id)){
            resolve(true)
        }else{
            reject(false)
        }
    })
}