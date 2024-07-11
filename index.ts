import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import Imap from 'node-imap'
import { inspect } from "util";
dotenv.config();




let imap = new Imap({
    user: "domingo.white@ethereal.email",
    password: "svqZ6Hmh8mdTQFz4Q7",
    host: "imap.ethereal.email",
    port: 993,
    tls: true,

});

function openInbox(cb: { (err: any, box: any): void; (error: Error, mailbox: Imap.Box): void; }) {
    imap.openBox("INBOX", true, cb);
}
function isPrintable(str: string) {
    return /^[\x20-\x7E\s]*$/.test(str);
}
imap.once("ready", function () {
    openInbox(function (err, box) {
        if (err) throw err;
        console.log(`Total messages in inbox: ${box.messages.total}`);
        if (box.messages.total === 0) {  // Check if there are no messages in the inbox
            console.log("No messages in the inbox.");
            imap.end();
            return;
        }

        // Ensure we have valid sequence numbers
        const start = Math.max(box.messages.total - 1, 1);
        const end = box.messages.total;

        console.log(`Fetching messages from ${start} to ${end}`);

        // let f = imap.seq.fetch(`${box.messages.total - 2}:${box.messages.total}`, {
        //     bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "1"],
        //     struct: true
        // });
        let f = imap.seq.fetch(`${start}:${end}`, {
            bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "1"],
            struct: true
        });

        f.on("message", function (msg, seqno) {
            console.log(`Message #%d`, seqno);
            let prefix = `("` + seqno + `)`;
            msg.on("body", function (stream, info) {
                let buffer = "";
                stream.on("data", function (chunk) {
                    buffer += chunk.toString("utf8");
                });
                stream.once("end", function () {
                    if (info.which === "1") {
                        let decodedBody = "";
                        decodedBody = Buffer.from(buffer, "base64").toString("utf8");
                        if (isPrintable(decodedBody)) {
                            console.log(prefix + 'Parsed body: %s', decodedBody);
                        }
                        else
                            console.log(prefix + 'Parsed body: %s', buffer);
                    }
                    else
                        console.log(prefix + `Parsed header: %s`, inspect(Imap.parseHeader(buffer)));
                });
            });
        });
        f.once("error", function (err) {
            console.log("Fetch error: " + err);
        });
        f.once("end", function () {
            console.log("Done fetching all messages!");
            imap.end();
        });
    });
});



imap.connect();


const app: Express = express();
const port = process.env.PORT || 3000;

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
