import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import _ from 'lodash';
import { DB } from './src/db/connect/connectToMongoDB'
import { ImapConnecting } from "./src/imap/ImapConnecting";

import uploadRoutes from './src/router/ImageUploadRouter'

import emailRoutes from './src/router/EmailRoutes'
dotenv.config();


const app: Express = express();
const port = 9002;



const startServer = () => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
};

// Initialize the app by connecting to DB and starting the server
const init = async () => {
    await DB();
    // await ImapConnecting.fetchAndSaveMessages();

    startServer();
};


init().catch(err => {
    console.error('Initialization failed:', err);
});




app.use('/email', emailRoutes)





// app.listen(port, () => {
//     console.log(`[server]: Server  http://localhost:${port}`);
// });

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     // host: "sandbox.smtp.mailtrap.io",
//     // port: 2525,
//     auth: {
//         user: 'mnvasanthcode@gmail.com',
//         pass: 'acmtacioalysooaq',
//     }
// })


// // app.get('/sent/email', async (req: Request, res: Response) => {
// //     try {
// //         const info = await transporter.sendMail(message);
// //         console.log(info);
// //         res.status(200).json({ message: `Email Sent: ${info.response}`, res: info });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(400).json({ message: "Error sending the email. Please try again later." });
// //     }
// // });
