import {Router} from "express";
import { registerAdmin, loginAdmin, addLibrarian, editLibrarian, getLibrarianDetails, deleteLibrarian, blockLibrarian, unblockLibrarian, createLibrary, editLibrary, deleteLibrary, listUsers, blockUser, unblockUser, getUserDetails, listUserHistory, uploadBookDetails, editBookDetails, listAllBooks, getBookDetails, deleteBook} from "../controllers/admin-controllers";
import { authenticateAdmin } from "../middleware/authMiddleware";
const adminRoutes = Router()

//Admin

adminRoutes.post('/register', registerAdmin)
adminRoutes.post('/login', loginAdmin)

//Librarian

adminRoutes.post('/librarian', authenticateAdmin, addLibrarian)
adminRoutes.put('/librarian/:id', authenticateAdmin, editLibrarian)
adminRoutes.get('/librarian/:librarianId', authenticateAdmin, getLibrarianDetails)
adminRoutes.delete('/librarian/:librarianId', authenticateAdmin, deleteLibrarian)
adminRoutes.put('/block/:librarianId', authenticateAdmin, blockLibrarian)
adminRoutes.put('/unblock/:librarianId', authenticateAdmin, unblockLibrarian)

//Library

adminRoutes.post('/library', authenticateAdmin, createLibrary)
//adminRoutes.put('/library/:libraryId/librarian', authenticateAdmin, addLibrarianToLibrary)
adminRoutes.put('/library/:libraryId', authenticateAdmin, editLibrary)
adminRoutes.delete('/library/:libraryId', authenticateAdmin, deleteLibrary)

//User

adminRoutes.get('/users', authenticateAdmin, listUsers)
adminRoutes.put('/user/block/:userId', authenticateAdmin, blockUser)
adminRoutes.put('/user/unblock/:userId', authenticateAdmin, unblockUser)
adminRoutes.get('/user/:userId', authenticateAdmin, getUserDetails)
adminRoutes.get('/user/history/:userId', authenticateAdmin, listUserHistory)

//Book

adminRoutes.post('/books', authenticateAdmin, uploadBookDetails)
adminRoutes.put('/books/:bookId', authenticateAdmin, editBookDetails)
adminRoutes.get('/books', listAllBooks)
adminRoutes.get('/books/:bookId', getBookDetails)
adminRoutes.delete('/books/:bookId', authenticateAdmin, deleteBook)


export default adminRoutes