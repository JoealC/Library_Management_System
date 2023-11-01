import {Router} from 'express'
import { registerUser, loginUser, updateUser, deleteUser, listAllBooks, filterBooks, borrowBook } from '../controllers/user-controller'
import {  authenticateUser } from '../middleware/authMiddleware'
import { loginValidator } from '../validators/login-validator';
import { UpdateValidator, registerValidator } from '../validators/admin-validator';
import { userIdValidator } from '../validators/user-validator';

const userRoutes = Router()

userRoutes.post('/register',registerValidator, registerUser);
userRoutes.post('/login',loginValidator, loginUser);
userRoutes.put('/update-user/:id', authenticateUser, UpdateValidator, updateUser )
userRoutes.delete('/delete-user/:id', authenticateUser,userIdValidator, deleteUser )

userRoutes.get('/list-books', authenticateUser, listAllBooks);
userRoutes.get('/filter-books', authenticateUser, filterBooks);
userRoutes.post('/borrow', authenticateUser, borrowBook);


export default userRoutes

