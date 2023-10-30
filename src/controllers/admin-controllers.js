import { Admin, validateAdmin } from "../models/Admin";
import { Librarian, validateLibrarian } from "../models/Librarian";
import { Library, validateLibrary } from "../models/Library";
import { User, validateUser } from "../models/User";
import { Book, validateBook } from "../models/Books";
import { sign } from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { successResponse, errorResponse } from "../middleware/response";
import { config } from "dotenv";
import { Borrowing } from "../models/Borrowing";
config()

export const registerAdmin = async(req, res) =>{
    try{
      const {error, value} = validateAdmin(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
      const{ username, email, password, user_Type} = value
      const existingAdmin = await Admin.findOne({username})
  
      if(existingAdmin){
        return errorResponse(res, 401, 'Admin Already Exists')
      }
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const newAdmin = new Admin({
        username,
        email,
        password: hashedPassword,
        user_Type,
      })
      console.log(newAdmin)
  
      await newAdmin.save()
  
      successResponse(res, 200, 'Admin registered successfully')
    }catch(err){
      errorResponse (res,500,"Internal Server Error")
    }
  }

export const loginAdmin = async(req, res) => {
    try{
      const {error, value} = validateAdmin(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
      const {username, email, password} = value
  
      const admin = await Admin.findOne({username, email})
  
      if(!admin){
        return errorResponse (res, 401, "Authentication failed")
      }
  
      const passwordMatch = await bcrypt.compare(password, admin.password)
      if(!passwordMatch){
        return errorResponse(res, 401, "Invalid Password")
      }
  
      const token = sign({username: admin.username, user_Type: admin.user_Type}, process.env.SECRET_KEY, {expiresIn:'1d'})
      successResponse(res, 200, ({token}))
    }catch(err){
      errorResponse (res, 500, "Internal Server Error")
    }
  }

export const addLibrarian = async(req, res) => {
    try{
      const {error, value} =validateLibrarian(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
        const {username, password, email, user_Type} = value
        const librarian = new Librarian({username, password, email, user_Type})
        await librarian.save()
        successResponse (res, 201, 'Librarian added successfully')
    }catch(err){
      console.log(err)
        errorResponse(res, 500, err.message)
    }
}

export const editLibrarian = async(req, res) => {
    try{
      const {error, value} = validateLibrarian(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
        const {username, password, email } = value
        const editLibrarian = await Librarian.findByIdAndUpdate(
            req.params.id,
            {
                username,
                password,
                email,
            },
            {new: true}
        )
        if(!editLibrarian){
            return errorResponse(res, 404, 'Librarian not found')
        }
        successResponse(res, 200, ({editLibrarian}))
    }catch(err){
        errorResponse(res, 500, 'Server error')
    }
}

export const getLibrarianDetails= async(req, res) =>{
    try{
      const {error, value} = validateLibrarian(req.params)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
        const {librarianId} = value
        const librarian = await Librarian.findById(librarianId)
        if(!librarian){
            res.json(librarian)
        }else{
            return errorResponse(res, 404, "Librarian not found")
        }
    }catch(error){
        errorResponse(res, 500, "Error in getting librarian details")
    }
}

export const deleteLibrarian = async(req, res) => {
    try {
      const {error, value} = validateLibrarian(req.params)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
        const { librarianId } = value;
        await Librarian.findByIdAndRemove(librarianId);
        res.json({ message: 'Librarian deleted successfully' });
      } catch (error) {
        errorResponse(res, 500, 'Error deleting librarian');
      }
}

export const blockLibrarian = async(req, res) => {
    try {
      // const {error, value} = validateLibrarian(req.params)
      // if(error){
      //   return errorResponse(res, 400, {error: error.details[0].message});
      // }
      //   const { librarianId } =value;
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
  
        res.json({ message: 'Librarian blocked successfully' });
      } catch (error) {
        console.log(error)
        errorResponse(res, 500, 'Error blocking librarian');
      }
}

export const unblockLibrarian = async(req, res) => {
    try{
      // const {error, value} = validateLibrarian(req.body)
      // if(error){
      //   return errorResponse(res, 400, {error: error.details[0].message});
      // }
    const {librarianId}  = req.params;
    console.log(librarianId)
    if (!librarianId) {
        return errorResponse(res, 400, 'Librarian ID is required');
    }

    const librarian = await Librarian.findById(librarianId);
    console.log(librarian)
    if (!librarian) {
       return errorResponse(res, 404, 'Librarian not found' );
    }

    if (!librarian.is_Blocked) {
        return successResponse(res, 400, 'Librarian is not blocked');
    }

    librarian.is_Blocked = false;
    await librarian.save();

    res.json({ message: 'Librarian unblocked successfully' });
  } catch (error) {
    console.log(error)
    errorResponse(res, 500, 'Error unblocking librarian' );
  }
}

export const createLibrary = async(req, res ) =>{
    try{
      const {error, value} = validateLibrary(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
        const {name, librarian} = value
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

// export const addLibrarianToLibrary = async(req, res) => {
//     try {
//       const {error, value} = validateLibrary(req.body)
//       if(error){
//         return errorResponse(res, 400, {error: error.details[0].message});
//       }
//         const { librarianId, libraryId } = value;
//         const librarian = await Librarian.findById(librarianId);
//         const library = await Library.findById(libraryId);
//         if (!librarian || !library) {
//             return errorResponse(res, 404, 'Librarian or library not found');
//           }
//           library.librarian.push(librarian);
//           await library.save();
//           res.json({ message: 'Librarian added to the library successfully' });
//         } catch (error) {
//             errorResponse(res, 500, 'Error in adding libraraian to library')
// }
// }

export const editLibrary = async (req, res ) =>{
    try {
        const { libraryId } = req.params;
        const { name, librarianId } = req.body;
        await Library.findByIdAndUpdate(libraryId, { name, librarian: librarianId });
        res.json({ message: 'Library details updated successfully' });
      } catch (error) {
        errorResponse(res, 500, 'Error updating library details');
      }
}

export const deleteLibrary = async (req, res ) =>{
    try {
      const {error, value} = validateLibrary(req.params)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
        const { libraryId } = value;
        await Library.findByIdAndRemove(libraryId);
        res.json({ message: 'Library deleted successfully' });
      } catch (error) {
        errorResponse(res, 500, 'Error deleting library');
      }
}

export const listUsers = async (req, res ) => {
    try{
        const users = await User.find().select("-password")
        res.json(users)
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
  
        res.json({ message: 'User blocked successfully' });
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

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    errorResponse(res, 500, 'Error unblocking user' );
  }
}

export const getUserDetails = async(req, res) => {
    try {
      // const {error, value} = validateUser(req.params)
      // console.log(value)
      // if(error){
      //   return errorResponse(res, 400, {error: error.details[0].message});
      // }
        const { userId } = req.params;
       // console.log(userId)
        const user = await User.findById(userId).select("-password");
        if (user) {
          return res.json(user);
        } else {
          return errorResponse(res, 404, 'User not found' );
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
            res.json(formattedHistory)
        }else{
            return errorResponse(res, 404, "No borrowing history found for this user")
        }
    }catch(err){
        errorResponse(res, 500, "Error listing user history")
    }
}

export const uploadBookDetails = async(req, res) =>{
    try {      
    const {error, value} = validateBook(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
     }
        const { title, author, ISBN, category, copies, description } = value;
        const book = new Book({ title, author, ISBN, category, copies, description });
        await book.save();
        successResponse (res,201, 'Book details uploaded successfully');
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
      res.json({message: "Book details upadted successfully"})
  }catch(err){
      errorResponse(res, 500, "Error updating book details")
  }
}

export const listAllBooks = async(req, res ) => {
    try{
        const books = await Book.find()
        res.json(books)
    }catch(err){
        errorResponse(res, 500, "Error in listing all books")
    }
}

export const getBookDetails= async(req, res) =>{
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);
        if (book) {
          res.json(book);
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
        await Book.findByIdAndRemove(bookId);
        res.json({ message: 'Book deleted successfully' });
      } catch (error) {
        return errorResponse(res, 500, 'Error deleting book');
      }
}