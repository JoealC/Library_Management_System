import {Router} from 'express'
import { registerUser, loginUser, listAllBooks, filterBooks, borrowBook } from '../controllers/user-controller'
import { authenticateUser } from '../middleware/authMiddleware'

const userRoutes = Router()

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);

userRoutes.get('/books', authenticateUser, listAllBooks);
userRoutes.get('/filter-books', authenticateUser, filterBooks);
userRoutes.post('/borrow', authenticateUser, borrowBook);


export default userRoutes

