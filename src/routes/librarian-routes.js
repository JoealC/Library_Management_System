import {Router} from "express"
import { registerLibrarian, loginLibrarian, listUsers, blockUser, unblockUser, getUserDetails,listUserHistory, uploadBookDetails, editBookDetails, listAllBooks, getBookDetails, deleteBook, approveBorrowRequest ,filterBooks, setDueDate, notifyUser, findUserByBookID } from "../controllers/librarian-controller"
import { authenticateLibrarian } from "../middleware/authMiddleware"
import { link } from "joi";
import { upload } from "../config/fileupload";

const librarianRoutes = Router()

//registration and login
librarianRoutes.post('/register',  registerLibrarian),
librarianRoutes.post('/login', loginLibrarian)

//User
librarianRoutes.get('/listusers', authenticateLibrarian, listUsers);
librarianRoutes.put('/block-user/:userId', authenticateLibrarian, blockUser);
librarianRoutes.put('/unblock-user/:userId', authenticateLibrarian, unblockUser);
librarianRoutes.get('/user-details/:userId', authenticateLibrarian, getUserDetails);
librarianRoutes.get('/user-history/:userId', authenticateLibrarian, listUserHistory);

//Books
librarianRoutes.post('/upload-book', upload.single('picture'), authenticateLibrarian, uploadBookDetails);
librarianRoutes.put('/edit-book/:bookId', authenticateLibrarian, editBookDetails);
librarianRoutes.get('/all-books', authenticateLibrarian, listAllBooks);
librarianRoutes.get('/book-details/:bookId', authenticateLibrarian, getBookDetails);
librarianRoutes.delete('/delete-book/:bookId', authenticateLibrarian, deleteBook);
librarianRoutes.put('/approve-borrow', authenticateLibrarian, approveBorrowRequest );
librarianRoutes.get('/filter-books', authenticateLibrarian, filterBooks);
librarianRoutes.put('/set-due-date', authenticateLibrarian, setDueDate);
librarianRoutes.post('/notify-users/:bookId', authenticateLibrarian, notifyUser);
librarianRoutes.get('/find-users-by-book/:bookId', authenticateLibrarian, findUserByBookID)

export default librarianRoutes