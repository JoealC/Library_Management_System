import { Book } from "../models/Books";
import { User, validateUser } from "../models/User";
import { sign } from "jsonwebtoken";
import { Borrowing, validateBorrowing } from "../models/Borrowing";
import { successResponse, errorResponse } from "../middleware/response";
import bcrypt from "bcrypt"
import { config } from "dotenv";
import e from "express";
config()

export const registerUser = async(req, res) =>{
    try{
      const {error, value} = validateUser(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
      const{ username, email, password, user_Type} = value
      const existingUser = await User.findOne({username})
  
      if(existingUser){
        return errorResponse(res, 401, 'User Already Exists')
      }
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        user_Type,
      })
      await newUser.save()
      successResponse(res, 200, 'User registered successfully')
    }catch(err){
      errorResponse (res,500,"Internal Server Error")
    }
  }

  export const loginUser = async(req, res) => {
    try{
      const {error, value} = validateUser(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
      const {username, password} = value
      const user = await User.findOne({username})
      if(!user){
        return errorResponse (res, 401, "Authentication failed")
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password)
      if(!passwordMatch){
        return errorResponse(res, 401, "Invalid Password")
      }
  
      const token = sign({username: user.username, user_Type: user.user_Type}, process.env.SECRET_KEY, {expiresIn:'1d'})
      successResponse(res, 200, ({token}))
    }catch(err){
      errorResponse (res, 500, "Internal Server Error")
    }
  }

  export const listAllBooks = async (req, res) => {
    try{
        const books = await Book.find()
        res.json(books)
    }catch(err){
        errorResponse (res, 500, 'Internal Server Error')
    }
  }

  export const filterBooks = async(req, res) => {
    try{
        const{title, author, category} = req.body
        const filter ={}
        if(title) {
            filter.title = title
        }
        if(author){
            filter.author = author
        }
        if(category){
            filter.category = category
        }
        const fileredBooks = await Book.find(filter)
        res.json(fileredBooks)
    }catch(error){
        errorResponse(res, 500, 'Error in filtering books')
    }
  }

  export const borrowBook = async(req, res) => {
    try{
        const {error, value} = validateBorrowing(req.body)
        if(error){
          return errorResponse(res, 400, {error: error.details[0].message});
        }
        const{user, book} = value
        const books = await Book.findById(book)
        if(!books){
            errorResponse(res, 404, "Book not found")
        }
        const borrowing = new Borrowing({
            user,
            book,
        })

        await borrowing.save()
        res.json({message: "Borrow request sent successfully"})

    }catch(err){
      console.log(err)
        errorResponse(res, 500, "Internal server error")
    }
  }

