import { Admin } from "../models/Admin";
import { Librarian } from "../models/Librarian";
import { Library } from "../models/Library";
import { User } from "../models/User";
import { Book } from "../models/Books";
import { sign } from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { successResponse, errorResponse } from "../middleware/response";
import { config } from "dotenv";
import { Borrowing } from "../models/Borrowing";
config()

export const registerAdmin = async(req, res) =>{
    try{
      const{ username, email, password} = req.body
      const existingAdmin = await Admin.findOne({username})
      if(existingAdmin){
        return errorResponse(res, 401, 'Admin Already Exists')
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const newAdmin = new Admin({
        username,
        email,
        password: hashedPassword,
      })
      await newAdmin.save()
      successResponse(res, 200, 'Admin registered successfully')
    }catch(err){
      errorResponse (res,500,"Internal Server Error")
    }
  }

export const loginAdmin = async(req, res) => {
    try{
      const {email, password} = req.body
      const admin = await Admin.findOne({email})
      if(!admin){
        return errorResponse (res, 401, "Authentication failed")
      }
      const passwordMatch = await bcrypt.compare(password, admin.password)
      if(!passwordMatch){
        return errorResponse(res, 401, "Invalid Password")
      }
      const token = sign({objectId: admin._id, username: admin.username}, process.env.SECRET_KEY, {expiresIn:'1d'})
      successResponse(res, 200, ({token}))
    }catch(err){
      errorResponse (res, 500, "Internal Server Error")
    }
  }

  export const updateAdmin = async (req, res) => {
    try{
      const {username, email, password} = req.body
      const hashedPassword = await bcrypt.hash(password, 10)
      const updateAdmin = await Admin.findByIdAndUpdate(
        req.params.id,
        {
          username,
          email,
          password: hashedPassword,
        },
        {new: true}  
      ).select("-password")
      if(!updateAdmin){
        return errorResponse(res, 404, "Admin not found")
      }
      successResponse(res, 200, "Updating Admin Successfull", updateAdmin)
    }catch(err){
      console.log(err)
      errorResponse(res, 500, "Internal Server Error")
    }
  }

export const deleteAdmin = async (req, res) => {
  try{
    const deleteAdmin = await Admin.findByIdAndDelete(req.params.id)
    if(!deleteAdmin){
      errorResponse(res, 404, 'Admin not found');
    }
    successResponse(res,200, "Admin deleted Successfully");
    }catch(err){
      console.log(err)
      errorResponse(res, 500, "Internal Server Error")
    }
  }


export const addLibrarian = async(req, res) => {
    try{
        const {username, password, email} = req.body
        const existingLibrarian = await Librarian.findOne({username})
        if(existingLibrarian){
          return errorResponse(res, 401, 'Librarian Already Exists')
        }
        const hashedPassword =await bcrypt.hash(password, 10)
        const newLibrarian = new Librarian({
          username,
          email,
          password: hashedPassword,
        })
        await newLibrarian.save()
        successResponse(res, 200, 'Librarian registered successfully')
      }catch(err){
        errorResponse (res,500,"Internal Server Error")
      }
    }

export const editLibrarian = async(req, res) => {
    try{
        const {username, password, email } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const editLibrarian = await Librarian.findByIdAndUpdate(
            req.params.id,
            {
                username,
                email,
                password: hashedPassword,
            },
            {new: true}
        ).select("-password")
        if(!editLibrarian){
            return errorResponse(res, 404, 'Librarian not found')
        }
        successResponse(res, 200, "Librarian edited successfully", editLibrarian)
    }catch(err){
        errorResponse(res, 500, 'Server error')
    }
}

export const getLibrarianDetails= async(req, res) =>{
    try{
        const {librarianId} = req.params
        const librarian = await Librarian.findById(librarianId).select("-password")
        if(!librarian){
          return errorResponse(res, 404, "Librarian not found")
        }else{ 
          successResponse(res, 200, librarian)
        }
    }catch(error){
        errorResponse(res, 500, "Error in getting librarian details")
    }
}

export const deleteLibrarian = async(req, res) => {
    try {
        const { librarianId } = req.params;
        const deleteLibrarian = await Librarian.findByIdAndRemove(librarianId);
        if(!deleteLibrarian){
          errorResponse(res, 404, "Librarian ID not found")
        }
        successResponse(res, 201, 'Librarian deleted successfully', );
      } catch (error) {
        errorResponse(res, 500, 'Error deleting librarian');
      }
}

export const blockLibrarian = async(req, res) => {
    try {
      const {librarianId} = req.params
        if (!librarianId) {
         return errorResponse(res, 400, 'Librarian ID is required');
        }
      const librarian = await Librarian.findById(librarianId);
        if (!librarian) {
           return errorResponse(res, 404, 'Librarian not found');
        }
      if (librarian.is_Blocked) {
          return successResponse(res, 400, 'Librarian is already blocked');
        }
        librarian.is_Blocked = true
        await librarian.save();
       successResponse(res, 200, 'Librarian blocked successfully');
      } catch (error) {
        console.log(error)
        errorResponse(res, 500, 'Error blocking librarian');
      }
}

export const unblockLibrarian = async(req, res) => {
    try{
    const {librarianId}  = req.params;
    if (!librarianId) {
        return errorResponse(res, 400, 'Librarian ID is required');
    }
    const librarian = await Librarian.findById(librarianId);
    if (!librarian) {
       return errorResponse(res, 404, 'Librarian not found' );
    }
    if (!librarian.is_Blocked) {
        return successResponse(res, 400, 'Librarian is not blocked');
    }
    librarian.is_Blocked = false;
    await librarian.save();
    successResponse(res, 200,'Librarian unblocked successfully');
  } catch (error) {
    console.log(error)
    errorResponse(res, 500, 'Error unblocking librarian' );
  }
}

export const createLibrary = async(req, res ) =>{
    try{
        const {name, librarian} = req.body
        const librarians = await Librarian.findById(librarian)
        if(librarians){
            const library = new Library({name: name, librarian: librarian})
            await library.save()
           return successResponse(res, 201, 'Library created and librarian assigned successfully')
        }else {
            return errorResponse(res, 404, 'Librarian not found')
        }
    }catch(error){
        errorResponse(res, 500, 'Error creating library and assigning librarian')
    }
}

export const listAllLibrary = async (req, res ) => {
  try{
      const allLibrary = await Library.find()
      if(allLibrary.length === 0){
       return errorResponse(res, 404, "No Library")
      }
      successResponse(res, 200, allLibrary)
  }catch(error){
      errorResponse(res, 500, "Error in listing library")
  }
}

export const editLibrary = async (req, res ) =>{
    try {
      
        const { libraryId } = req.params;
        const updateLibrary = await Library.findByIdAndUpdate(libraryId, req.body, { new : true });
        successResponse(res, 201, 'Library details updated successfully', updateLibrary );
      } catch (error) {
        errorResponse(res, 500, 'Error updating library details');
      }
}

export const deleteLibrary = async (req, res ) =>{
    try {
        const { libraryId } = req.params
        const deleteLibrary = await Library.findByIdAndDelete(libraryId);
        if(!deleteLibrary){
          return errorResponse(res, 404, "Library ID is not found")
        }
        successResponse(res, 200, 'Library deleted successfully');
      } catch (error) {
        errorResponse(res, 500, 'Error deleting library');
      }
}

export const listUsers = async (req, res ) => {
    try{
        const users = await User.find().select("-password")
        if(users.length === 0){
         return errorResponse(res, 404, "No users in list")
        }
        successResponse(res, 200, users)
    }catch(error){
        errorResponse(res, 500, "Error in listing users")
    }
}

export const blockUser = async(req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
          return errorResponse(res, 400, 'User ID is required');
        }
        const user = await User.findById(userId);
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }
        if (user.is_Blocked) {
           return successResponse(res, 400, 'User is already blocked');
        }
        user.is_Blocked = true;
        await user.save();
        successResponse(res, 200,'User blocked successfully');
      } catch (error) {
        errorResponse(res, 500, 'Error blocking User');
      }
}

export const unblockUser = async(req, res) => {
    try{
    const { userId } = req.params;
    if (!userId) {
        return errorResponse(res, 400, 'User ID is required');
    }
    const user = await User.findById(userId);
    if (!user) {
       return errorResponse(res, 404, 'User not found' );
    }
    if (!user.is_Blocked) {
        return successResponse(res, 400, 'User is not blocked');
    }
    user.is_Blocked = false;
    await user.save();
    successResponse(res, 200, 'User unblocked successfully');
  } catch (error) {
    errorResponse(res, 500, 'Error unblocking user' );
  }
}

export const getUserDetails = async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");
        if (!user) {
          return errorResponse(res, 404, 'User not found' );
        } else {
          return successResponse(res, 200, user);
        }
      } catch (error) {
        errorResponse(res, 500, 'Error getting user details');
      }
}

export const listUserHistory = async(req, res ) => {
    try{
        const {userId} = req.params
        const histroy = await Borrowing.find({user: userId}).populate('Book')
        if(history.length > 0){
            const formattedHistory = histroy.map((record) =>{
                return{
                    book: record.book,
                    borrowedDate: record.borrowedDate,
                    returnDate: record.returnedDate
                }
            })
            return successResponse(res, 200, formattedHistory)
        }else{
            return errorResponse(res, 404, "No borrowing history found for this user")
        }
    }catch(err){
        errorResponse(res, 500, "Error listing user history")
    }
}

export const uploadBookDetails = async(req, res) =>{
    try {     
        const { title, author, ISBN, category, copies, description } = req.body;
        const book = new Book({ title, author, ISBN, category, copies, description });
        await book.save();
        successResponse (res,201, 'Book details uploaded successfully', book);
      } catch (error) {
        console.log(error)
        errorResponse(res, 500, 'Error uploading book details');
      }
}

export const editBookDetails = async(req, res) => {
  try{
      const{bookId} = req.params
      const{title, author, ISBN, category, copies, description}= req.body
      const book = await Book.findById(bookId)
      if(!book){
          return errorResponse(res, 404, "Book not found")
      }
      book.title = title,
      book.author = author,
      book.ISBN = ISBN,
      book.category = category,
      book.copies = copies,
      book.description = description

      await book.save()
      successResponse(res, 201, "Book details upadted successfully", book)
  }catch(err){
      errorResponse(res, 500, "Error updating book details")
  }
}

export const listAllBooks = async(req, res ) => {
    try{
        const books = await Book.find()
        if(books.length === 0){
          return errorResponse(res, 404, "No books in list")
        }
        successResponse(res, 200, books)
    }catch(err){
        errorResponse(res, 500, "Error in listing all books")
    }
}

export const getBookDetails= async(req, res) =>{
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);
        if (book) {
          return successResponse(res, 200, book)
        } else {
          return errorResponse(res, 404, 'Book not found');
        }
      } catch (error) {
        return errorResponse (res, 500, 'Error getting book details');
      }
}

export const deleteBook = async(req, res ) => {
    try {
        const { bookId } = req.params;
        const deleteBook = await Book.findByIdAndDelete(bookId);
        if(!deleteBook){
          errorResponse(res, 404, "Book ID is not found")
        }
        successResponse(res, 200, 'Book deleted successfully');
      } catch (error) {
        return errorResponse(res, 500, 'Error deleting book');
      }
}