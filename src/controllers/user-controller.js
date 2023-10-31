import { Book } from "../models/Books";
import { User } from "../models/User";
import { sign } from "jsonwebtoken";
import { Borrowing } from "../models/Borrowing";
import { successResponse, errorResponse } from "../middleware/response";
import bcrypt from "bcrypt"
import { config } from "dotenv";
config()

export const registerUser = async(req, res) =>{
    try{
      const{ username, email, password, user_Type} = req.body
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
      const {username, password} = req.body
      const user = await User.findOne(username)
      if(!user){
        return errorResponse (res, 401, "Authentication failed")
      }
      const passwordMatch = await bcrypt.compare(password, user.password)
      if(!passwordMatch){
        return errorResponse(res, 401, "Invalid Password")
      }
      const token = sign({objectId: user._id, username: user.username, user_Type: user.user_Type}, process.env.SECRET_KEY, {expiresIn:'1d'})
      successResponse(res, 200, ({token}))
    }catch(err){
      errorResponse (res, 500, "Internal Server Error")
    }
  }

  export const updateUser = async (req, res) => {
    try{
      const {username, email, password} = req.body
      const hashedPassword = await bcrypt.hash(password, 10)
      const upadteUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          username,
          email,
          password: hashedPassword,
        },
        {new: true}  
      )
      if(!upadteUser){
        errorResponse(res, 404, "Admin not found")
      }
      successResponse(res, 200, "Updating Admin Successfull", upadteUser)
    }catch(err){
      console.log(err)
      errorResponse(res, 500, "Internal Server Error")
    }
  }

export const deleteUser = async (req, res) => {
  try{
    const deleteUser = await Admin.findByIdAndDelete(req.params.id)
    if(!deleteUser){
      errorResponse(res, 404, 'Admin not found');
    }
    successResponse(res,200, "Admin deleted Successfully");
    }catch(err){
      console.log(err)
      errorResponse(res, 500, "Internal Server Error")
    }
  }

export const listAllBooks = async (req, res) => {
    try{
        const books = await Book.find()
        if(books.length === 0){
          errorResponse(res, 404, "No Books in list")
        }
        successResponse(res, 200, books)
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
        successResponse(res, 200, fileredBooks)
    }catch(error){
        errorResponse(res, 500, 'Error in filtering books')
    }
  }

  export const borrowBook = async(req, res) => {
    try{
        const{user, book} = req.body
        const books = await Book.findById(book)
        if(!books){
            errorResponse(res, 404, "Book not found")
        }
        const borrowing = new Borrowing({
            user,
            book,
        })
        await borrowing.save()
        successResponse(res, 200, {message: "Borrow request sent successfully"})

    }catch(err){
      console.log(err)
        errorResponse(res, 500, "Internal server error")
    }
  }

