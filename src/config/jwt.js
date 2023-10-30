import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()
const jwtsecretKey = process.env.SECRET_KEY
const expiresIn = '1d'

export const generaToken = (payload) => {
    return jwt.sign(payload, jwtsecretKey, expiresIn)
}

export const verifyToken = (token) =>{
    try{
       return jwt.verify(token, jwtsecretKey)
    }catch(err){
        return null
    }
}