import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

import imap from "imap-simple";
import nodemailer from 'nodemailer';
import _ from 'lodash';
import { simpleParser } from 'mailparser';
dotenv.config();


const app: Express = express();
const port = process.env.PORT || 3000;


interface MessageAttributes {
    uid: number;
}

interface MessageBodyPart {
    which: string;
    size: number;
    body: string;
    encoding?: string;
    parts?: MessageBodyPart[];
}

interface Message {
    attributes: MessageAttributes;
    parts: MessageBodyPart[];
}


// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });


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
    subject: "Hello",
    html: `<h3>You sddddddddddddddddddddddddddd dd</h1>`,
    messageId: '809-66792323-233'
}


app.get('/sent/email', async (req: Request, res: Response) => {
    try {
        const info = await transporter.sendMail(message);
        console.log(info);
        res.status(200).json({ message: `Email Sent: ${info.response}`, res: info });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error sending the email. Please try again later." });
    }
});
// app.get('/sent/email', async (req: Request, res: Response) => {
//     let emailse = await transporter.sendMail(message, (err, info) => {
//         if (err) {
//             return res.status(400).json({ message: "Error sending the email. Please try again later." })
//         }

//         console.log(emailse);


//         res.status(200).json({ meassage: `Email Sent: ${info.response}`, res: "emailse" })
//     })

// });

// Get Re[lay and All Emailes



var config = {
    imap: {
        user: 'mnvasanthcode@gmail.com',
        password: 'acmtacioalysooaq',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

function getBody(parts: any, which: string): string {
    const part = parts.find(part => part.which === which);
    if (!part) return ''; // Handle undefined part

    let body = part.body;

    if (part.encoding === 'BASE64') {
        body = Buffer.from(body, 'base64').toString('utf-8');
    } else if (part.encoding === 'QUOTED-PRINTABLE') {
        body = body.replace(/=([A-Fa-f0-9]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        });
    }

    return body;
}

app.get('/getAll', async (req: Request, res: Response) => {

    await imap.connect(config).then(async connection => {
        await connection.openBox('INBOX');
        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };
        const messages = await connection.search(searchCriteria, fetchOptions);
        // messages.forEach(item => {
        //     const all = item.parts.find(part => part.which === 'HEADER');
        //     const id = item.attributes.uid;
        //     const idHeader = 'Imap-Id: ' + id + '\r\n';
        //     simpleParser(idHeader + all.body, (err, mail) => {
        //         if (mail.messageId === '809-66792323-233') {
        //             console.log('Email found with message ID:', mail.messageId);
        //             console.log('Subject:', mail.subject);
        //             console.log('From:', mail.from.text);
        //             console.log('To:', mail.to.text);
        //             console.log('Date:', mail.date);
        //         }
        //     });
        // });
        for (const item of messages) {
            const all = item.parts.find(part => part.which === 'HEADER');
            const idHeader = 'Imap-Id: ' + item.attributes.uid + '\r\n';

            const mail = await simpleParser(idHeader + all.body);

            if (mail.messageId === '809-66792323-233') {
                connection.end();
                return {
                    messageId: mail.messageId,
                    subject: mail.subject,
                    from: mail.from.text,
                    to: mail.to.text,
                    date: mail.date,
                };
            }
        }

        connection.end();
    }).catch(err => {
        console.log(err);
    });

    // try {
    //     const connection = await imap.connect({ imap: config.imap });
    //     await connection.openBox('INBOX');
    //     const searchCriteria = ['ALL'];
    //     const fetchOptions = {
    //         bodies: ['HEADER', 'TEXT'],
    //         struct: true
    //     };

    //     const messages: Message[] = await connection.search(searchCriteria, fetchOptions);

    //     const emailData = messages.map((item: any) => {

    //         // if (item.attributes.uid) {
    //         // const parts = _.flattenDeep(item.parts.map(part => part.parts ? part.parts : part));
    //         // const body = getBody(parts, 'TEXT');
    //         // return {
    //         //     id: item.attributes.uid, // Extract message ID
    //         //     body: body
    //         // };
    //         // // }
    //         // return []

    //         return item
    //     });


    //     res.json(emailData[emailData.length - 1]);
    //     connection.end();
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Error fetching emails.');
    // }
});


// app.get('/getAll', (req: Request, res: Response) => {
//     imap.connect(config).then(async function (connection: { openBox: (arg0: string) => Promise<any>; search: (arg0: string[], arg1: { bodies: string[]; }) => Promise<any>; }) {
//         await connection.openBox('INBOX');
//         var searchCriteria = ['1:5'];
//         var fetchOptions = {
//             bodies: ['HEADER', 'TEXT'],
//         };
//         const messages = await connection.search(searchCriteria, fetchOptions);
//         messages.forEach(function (item: { parts: any; }) {
//             var all = _.find(item.parts, { "which": "TEXT" });
//             var html = (Buffer.from(all.body, 'base64').toString('ascii'));
//             console.log(html);
//         });
//     });
// })






// app.get("/", (req: Request, res: Response) => {
//     res.send("+ TypeScript Server");
// });


// app.use('/',)

app.post("/file", upload.single('image'), (req: Request, res: Response) => {
    const file = req.file;
    console.log(file);

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    console.log(`Received file: ${file.originalname}`);
    console.log(`File size: ${file.size} bytes`);

    // You can process the file here (e.g., save it to disk, upload to cloud storage, etc.)

    res.send(`File received: ${file.originalname}`);
});



app.listen(port, () => {
    console.log(`[server]: Server  http://localhost:${port}`);
});
