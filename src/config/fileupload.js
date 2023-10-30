
import multer from "multer";
import path from 'path'


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        // const ext = file.originalname.split('.').pop()
        // cb(null, 'book-' + uniqueSuffix + '.' + ext)
        cb(null, Date.now() + path.extname(file.originalname))
     }
})


export const upload = multer({storage: storage})





