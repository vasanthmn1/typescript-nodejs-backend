import { Request, Response } from "express";
import nodemailer from 'nodemailer'

export class SentEmailController {



    sentEmail = async (req: Request, res: Response) => {

        let body = req.body;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            // host: "sandbox.smtp.mailtrap.io",
            // port: 2525,
            auth: {
                user: 'mnvasanthcode@gmail.com',
                pass: 'acmtacioalysooaq',
            }
        })

        const message = {
            from: 'mnvasanthcode@gmail.com',
            to: 'mnvasanth4@gmail.com',
            subject: "Hello #50784",
            html: `<h3>You Senemail dd</h1>`,
            messageId: '809-66792323-233'
        }
        try {
            const info = await transporter.sendMail(message);
            console.log(info);
            res.status(200).json({ message: `Email Sent: ${info.response}`, res: info });
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: "Error sending the email. Please try again later." });
        }


    }

}