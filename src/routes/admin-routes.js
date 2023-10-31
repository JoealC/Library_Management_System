import {Router} from "express";
import { registerAdmin, loginAdmin, updateAdmin, deleteAdmin, addLibrarian, editLibrarian, getLibrarianDetails, deleteLibrarian, blockLibrarian, unblockLibrarian, createLibrary, editLibrary, listAllLibrary, deleteLibrary, listUsers, blockUser, unblockUser, getUserDetails, listUserHistory, uploadBookDetails, editBookDetails, listAllBooks, getBookDetails, deleteBook} from "../controllers/admin-controllers";
import { authenticateAdmin } from "../middleware/authMiddleware";
import { UpdateValidator, adminAddLibrarianValidator, adminEditLibrarianValidator, adminLibrarianIdValidator, adminUpdateValidator, deleteValidator, registerValidator } from "../validators/admin-validator";
import { loginValidator } from "../validators/login-validator";
import { createLibraryValidator, libraryIdValidator } from "../validators/library-validator";
import { userIdValidator } from "../validators/user-validator";
import { bookIdValidator, bookValidator } from "../validators/book-validator";
const adminRoutes = Router()

//Admin

adminRoutes.post('/register', registerValidator, registerAdmin)
adminRoutes.post('/login',loginValidator, loginAdmin)
adminRoutes.put('/update-admin', authenticateAdmin, UpdateValidator, updateAdmin)
adminRoutes.delete('/delete-admin', authenticateAdmin, deleteValidator, deleteAdmin)

//Librarian

adminRoutes.post('/add-librarian', authenticateAdmin,adminAddLibrarianValidator, addLibrarian) 
adminRoutes.put('/edit-librarian/:id', authenticateAdmin, adminEditLibrarianValidator, adminLibrarianIdValidator, editLibrarian)
adminRoutes.get('/get-librarian/:librarianId', authenticateAdmin, getLibrarianDetails)
adminRoutes.delete('/delete-librarian/:librarianId', authenticateAdmin, adminLibrarianIdValidator ,deleteLibrarian)
adminRoutes.put('/block/librarian/:librarianId', authenticateAdmin,adminLibrarianIdValidator, blockLibrarian)
adminRoutes.put('/unblock/librarian/:librarianId', authenticateAdmin,adminLibrarianIdValidator, unblockLibrarian)

//Library

adminRoutes.post('/create-library', authenticateAdmin,createLibraryValidator, createLibrary)
adminRoutes.put('/edit-library/:libraryId', authenticateAdmin,libraryIdValidator, editLibrary)
adminRoutes.get('/listall-library-details', authenticateAdmin, listAllLibrary)
adminRoutes.delete('/delete-library/:libraryId', authenticateAdmin,libraryIdValidator, deleteLibrary)

//User

adminRoutes.get('/list-users', authenticateAdmin, listUsers)
adminRoutes.put('/user/block/:userId', authenticateAdmin,userIdValidator, blockUser)
adminRoutes.put('/user/unblock/:userId', authenticateAdmin,userIdValidator, unblockUser)
adminRoutes.get('/get-user/:userId', authenticateAdmin, getUserDetails)
adminRoutes.get('/user/history/:userId', authenticateAdmin, listUserHistory)

//Book

adminRoutes.post('/uploadbooks', authenticateAdmin,bookValidator, uploadBookDetails)
adminRoutes.put('/edit-books/:bookId', authenticateAdmin,bookIdValidator, editBookDetails)
adminRoutes.get('/lsit-books', listAllBooks)
adminRoutes.get('/get-books/:bookId', getBookDetails)
adminRoutes.delete('/delete-books/:bookId', authenticateAdmin,bookIdValidator, deleteBook)


export default adminRoutes