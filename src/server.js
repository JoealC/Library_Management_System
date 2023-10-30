import express from 'express'
import adminRoutes from './routes/admin-routes'
import userRoutes from './routes/user-routes'
import librarianRoutes from './routes/librarian-routes'
import { json } from 'body-parser'
import { connectDatabase } from './config/database'





const app = express()
const PORT = 3000
connectDatabase()

app.use(json())

app.use('/admin', adminRoutes)
app.use('/user', userRoutes)
app.use('/librarian', librarianRoutes)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})