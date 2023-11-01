import {Router} from "express"
import { registerLibrarian, loginLibrarian,updateLibrarian, deleteLibrarian, listUsers, blockUser, unblockUser, getUserDetails,listUserHistory, uploadBookDetails, editBookDetails, listAllBooks, getBookDetails, deleteBook, approveBorrowRequest ,filterBooks, setDueDate, notifyUser, findUserByBookID } from "../controllers/librarian-controller"
import { authenticateLibrarian } from "../middleware/authMiddleware"
import { upload } from "../config/fileupload";
import { UpdateValidator } from "../validators/admin-validator";
import { loginValidator } from "../validators/login-validator";
import { librarianIdValidator, librarianRegisterValidator } from "../validators/librarian-validator";
import { userIdValidator } from "../validators/user-validator";
import { bookIdValidator, bookValidator } from "../validators/book-validator";

const librarianRoutes = Router()

//registration and login
librarianRoutes.post('/register',librarianRegisterValidator,  registerLibrarian),
librarianRoutes.post('/login',loginValidator, loginLibrarian)
librarianRoutes.put('/update-librarian/:id', authenticateLibrarian, UpdateValidator, updateLibrarian)
librarianRoutes.delete('/delete-librarian/:id', authenticateLibrarian,librarianIdValidator, deleteLibrarian)

//User
librarianRoutes.get('/listusers', authenticateLibrarian, listUsers);
librarianRoutes.put('/block-user/:userId', authenticateLibrarian,userIdValidator, blockUser);
librarianRoutes.put('/unblock-user/:userId', authenticateLibrarian,userIdValidator, unblockUser);
librarianRoutes.get('/user-details/:userId', authenticateLibrarian, getUserDetails);
librarianRoutes.get('/user-history/:userId', authenticateLibrarian, listUserHistory);

//Books
librarianRoutes.post('/upload-book', upload.single('picture'), authenticateLibrarian,bookValidator, uploadBookDetails);
librarianRoutes.put('/edit-book/:bookId', authenticateLibrarian,bookIdValidator, editBookDetails);
librarianRoutes.get('/list-books', authenticateLibrarian, listAllBooks);
librarianRoutes.get('/book-details/:bookId', authenticateLibrarian, getBookDetails);
librarianRoutes.delete('/delete-book/:bookId', authenticateLibrarian, bookIdValidator, deleteBook);
librarianRoutes.put('/approve-borrow', authenticateLibrarian, approveBorrowRequest );
librarianRoutes.get('/filter-books', authenticateLibrarian, filterBooks);
librarianRoutes.put('/set-due-date', authenticateLibrarian, setDueDate);
librarianRoutes.post('/notify-users/:bookId', authenticateLibrarian, notifyUser);
librarianRoutes.get('/find-user-by-book/:bookId', authenticateLibrarian,bookIdValidator, findUserByBookID)

export default librarianRoutes