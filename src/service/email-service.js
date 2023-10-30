import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

class notificationService{
    constructor(){
this.transporter = nodemailer.createTransport({
            host: process.env.host,
            port: process.env.port,
            service:"Gmail",
            auth:{
                user: process.env.user,
                pass: process.env.pass
            },
            tls:{
                rejectUnauthorized: false
            },
        })
    }
    sendEmail(to, subject, text){
        const mailOptions = {
            from: process.env.user,
            to,
            subject,
            text,
        }
    this.transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.error('Error sending in email', error)
        }else{
            console.log('Email sent:', info.response)
        }
    })
    }
}

export default new notificationService
       