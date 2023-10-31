import jwt, { decode } from 'jsonwebtoken'
import { config } from 'dotenv'
import { errorResponse } from './response';
import { Admin } from '../models/Admin';
import { Librarian } from '../models/Librarian';
import { User } from '../models/User';
config()

export const authenticateAdmin = async(req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return errorResponse (res,401, 'Unauthorized');
  }
  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const adminId = await Admin.findById(decoded.objectId)
    if(adminId === "null"){
       return errorResponse(res, 403, 'Forbidden. Admin access required')
    }
    req.user = decoded
    next()
  }catch(err){
    console.log(err)
    errorResponse(res, 400, 'Invalid Token.')
  }
}

export const authenticateLibrarian = async(req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
     return errorResponse (res,401, 'Unauthorized');
    }
    try{
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const librarianId = await Librarian.findById(decoded.objectId)
      if(librarianId !== 'null'){
         return errorResponse(res, 403, 'Forbidden. Librarian access required')
      }
      req.user = decoded
      next()
    }catch(err){
      errorResponse(res, 400, 'Invalid Token.')
    }
  }

  export const authenticateUser = async(req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
     return errorResponse (res,401, 'Unauthorized');
    }
    try{
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const userId = await User.findById(decode.objectId)
      if(userId !== 'null'){
         return errorResponse(res, 403, 'Forbidden. User access required')
      }
      req.user = decoded
      next()
    }catch(err){
      errorResponse(res, 400, 'Invalid Token.')
    }
  }
