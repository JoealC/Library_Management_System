import { Book, validateBook } from "../models/Books";
import { User, validateUser } from "../models/User";
import { Librarian, validateLibrarian } from "../models/Librarian";
import { sign } from "jsonwebtoken";
import { Borrowing } from "../models/Borrowing";
import { notificationService } from "../service/email-service";
import { successResponse, errorResponse } from "../middleware/response";
import bcrypt from "bcrypt"
import { config } from "dotenv";
config()

export const registerLibrarian = async(req, res) =>{
  try{
    const {error, value} = validateLibrarian(req.body)
    if(error){
      return errorResponse(res, 400, {error: error.details[0].message});
    }
    const{ username, email, password, user_Type} = value
    const existingLibrarian = await Librarian.findOne({username})

    if(existingLibrarian){
      return errorResponse(res, 401, 'Librarian Already Exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newLibrarian = new Librarian({
      username,
      email,
      password: hashedPassword,
      user_Type,
    })
    console.log(newLibrarian)

    await newLibrarian.save()

    successResponse(res, 200, 'Librarian registered successfully')
  }catch(err){
    errorResponse (res,500,"Internal Server Error")
  }
}

export const loginLibrarian = async(req, res) => {
  try{
    const {error, value} = validateLibrarian(req.body)
    if(error){
      return errorResponse(res, 400, {error: error.details[0].message});
    }
    const {username, email, password} = value

    const librarian = await Librarian.findOne({username, email})

    if(!librarian){
      return errorResponse (res, 401, "Authentication failed")
    }

    const passwordMatch = await bcrypt.compare(password, librarian.password)
    if(!passwordMatch){
      return errorResponse(res, 401, "Invalid Password")
    }

    const token = sign({username: librarian.username, user_Type: librarian.user_Type}, process.env.SECRET_KEY, {expiresIn:'1d'})
    successResponse(res, 200, ({token}))
  }catch(err){
    errorResponse (res, 500, "Internal Server Error")
  }
}

export const listUsers = async (req, res) => {
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
        return errorResponse(res, 400, 'Librarian ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
       return errorResponse(res, 404, 'Librarian not found' );
    }

    if (!user.is_Blocked) {
        return successResponse(res, 400, 'Librarian is not blocked');
    }

    user.is_Blocked = false;
    await user.save();

    res.json({ message: 'Librarian unblocked successfully' });
  } catch (error) {
    errorResponse(res, 500, 'Error unblocking librarian' );
  }
}

export const getUserDetails = async(req, res) => {
    try {
      // const {error, value} = validateUser(req.params)
      // if(error){
      //   return errorResponse(res, 400, {error: error.details[0].message});
      // }
        const { userId } = req.params;
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

export const uploadBookDetails = async (req, res ) =>{
  try{
      const {error, value} = validateBook(req.body)
      if(error){
        return errorResponse(res, 400, {error: error.details[0].message});
      }
      const { title, author, ISBN, category, copies, description } = value
      console.log(req.file)
      const images = req.file.map((file) => file.filename)
      const book = new Book({title, author, ISBN, category, copies, description, images})
      await book.save()
      successResponse(res, 201, "Book details uploaded successfully")
  }catch(error){
    console.log(error)
      errorResponse(res, 500, 'Error uploading book details')
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

export const approveBorrowRequest = async(req, res) => {
  try{
      const {borrowingId, isApproved} = req.body
      const borrowing = await Borrowing.findById(borrowingId)
      if(!borrowing){
          return errorResponse(res, 404, "Borrowing request not found")

      }
      borrowing.isApproved = isApproved
      await borrowing.save()
      res.json({message: isApproved? 'Borrowing request approved' : 'Borrowing request rejected'})
  }catch(err){
      errorResponse(res, 500, "Internal server error")
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

export const setDueDate = async(req, res) => {
    try{
        const {bookId, due_Date}  = req.body
        const book = await Book.findById(bookId)
        if(!book){
            errorResponse(res, 404, "Book not found")
        }
        const borrowing = await Borrowing.findOne({book: bookId, returnDate: null})
        if(!borrowing){
            errorResponse(res, 400, 'The book is not currently borrowed')
        }
        borrowing.due_Date = new Date(due_Date)
        await borrowing.save()
        res.json({message: 'Due date set successfully'})
    }catch(error){
        errorResponse(res, 500, 'Error setting in due date')
    }
}

export const notifyUser = async(req, res) => {
    try{
        const {bookId} = req.params
        const book = await Book.findById(bookId)
        if(!book){
          return errorResponse(res, 404, 'Book not found')
        }

        const borrowings = await Borrowing.find({book: bookId})
        for(const borrowing of borrowings){
            const user = await User.findById(borrowing.user)
            const notificationSubject = 'Bood Due Date Reminder'
            const notificationText = `Dear ${user.username},\n\nThis is a reminder that the book "${book.title}" is due on ${borrowing.due_Date}. Please return it on time.\n\nThank you.`
            notificationService.sendEmail(user.email, notificationSubject, notificationText)
            borrowing.notificationSent = true 
            await borrowing.save()
        }
        res.json({message: 'User notified successfully'})
    }catch(err){
      console.log(err)
        errorResponse(res, 500, "Error notifying users")
    }
}

export const findUserByBookID = async(req, res) => {
    try{
        const { bookId } = req.params
        const book = await Book.findById(bookId)
        if (!book) {
          return errorResponse (res, 404, 'Book not found')
        }
        const borrowings = await Borrowing.find({ book: bookId, returnDate: null })

        if (borrowings.length === 0) {
          return errorResponse (res, 400, 'No users have borrowed the book' )
        }
        const userIds = borrowings.map((borrowing) => borrowing.user);
        const users = await User.find({ _id: { $in: userIds } }).select("-password");
  
        res.json(users);
      } catch (error) {
        errorResponse(res ,500, 'Error finding users by book ID');
      }
}
