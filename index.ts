import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import _ from 'lodash';
import { DB } from './src/db/connect/connectToMongoDB'
import { ImapConnecting } from "./src/imap/ImapConnecting";

import uploadRoutes from './src/router/ImageUploadRouter'
dotenv.config();


const app: Express = express();
const port = 9000;



const startServer = () => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
};

// Initialize the app by connecting to DB and starting the server
const init = async () => {
    await DB();
    await ImapConnecting.fetchAndSaveMessages();

    startServer();
};


init().catch(err => {
    console.error('Initialization failed:', err);
});




app.use('/image', uploadRoutes)





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
// // const message = {
// //     from: 'mnvasanthcode@gmail.com',
// //     to: 'mnvasanth4@gmail.com',
// //     subject: "Hello",
// //     html: `<h3>You sddddddddddddddddddddddddddd dd</h1>`,
// //     messageId: '809-66792323-233'
// // }

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
