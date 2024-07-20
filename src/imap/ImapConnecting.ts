

// 

import { ImapFlow } from "imapflow";
import Message from "../db/entity/Message";


export class ImapConnecting {

    static fetchAndSaveMessages = async () => {
        const client = new ImapFlow({
            host: 'imap.gmail.com',
            port: 993,
            secure: true,
            auth: {
                user: 'mnvasanthcode@gmail.com',
                pass: 'acmtacioalysooaq',
            }
        });

        await client.connect();


        let lock;
        let pushMessage = []
        let sureccMessage = []
        try {
            lock = await client.getMailboxLock('INBOX');
            for await (const message of client.fetch('1:*', { envelope: true, source: true })) {
                const { envelope, source } = message;
                const newMessage = new Message({
                    uid: message.uid,
                    from: envelope.from[0].address,
                    subject: envelope.subject,
                    date: envelope.date,
                    body: source.toString(),
                });
                await newMessage.save();
                pushMessage.push(envelope)
                sureccMessage.push(source.toString())
                // console.log(`Saved message: ${envelope}`);
            }

            console.log('Filnan', pushMessage[2]);
            console.log('sUr', sureccMessage[2]);
        } finally {
            lock?.release();
        }

        await client.logout();
    }




}