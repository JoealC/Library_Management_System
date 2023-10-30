import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { errorResponse } from './response';
config()

export const authenticateAdmin = async(req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return errorResponse (res,401, 'Unauthorized');
  }

  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if(decoded.user_Type !== 'admin'){
       return errorResponse(res, 403, 'Forbidden. Admin access required')
    }
    // console.log(123)
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
      if(decoded.user_Type !== 'librarian'){
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
      if(decoded.user_Type !== 'user'){
         return errorResponse(res, 403, 'Forbidden. User access required')
      }
      req.user = decoded
      next()
    }catch(err){
      errorResponse(res, 400, 'Invalid Token.')
    }
  }
