import {Router} from 'express'
import { registerUser, loginUser, updateUser, deleteUser, listAllBooks, filterBooks, borrowBook } from '../controllers/user-controller'
import {  authenticateUser } from '../middleware/authMiddleware'
import { loginValidator } from '../validators/login-validator';
import { UpdateValidator, registerValidator } from '../validators/admin-validator';
import { userIdValidator } from '../validators/user-validator';
import { filterBookValidator } from '../validators/filter-book-validator';

const userRoutes = Router()

userRoutes.post('/register',registerValidator, registerUser);
userRoutes.post('/login',loginValidator, loginUser);
userRoutes.put('/update-user', authenticateUser, UpdateValidator, updateUser )
userRoutes.delete('/delete-user', authenticateUser,userIdValidator, deleteUser )

userRoutes.get('/list-books', authenticateUser, listAllBooks);
userRoutes.get('/filter-books', authenticateUser,filterBookValidator, filterBooks);
userRoutes.post('/borrow', authenticateUser, borrowBook);


export default userRoutes

