
import { ImapFlow } from 'imapflow';

class ImapUtils {
    static connecting = async () => {
        let client = new ImapFlow({
            host: 'imap.example.com',
            port: 993,
            secure: true,
            auth: {
                user: 'your-email@example.com',
                pass: 'your-password'
            }
        });


        try {
            await client.connect();
            console.log('IMAP server connected');
        } catch (err) {
            console.error('Error connecting to IMAP server:', err);
            throw err;
        }
    }


}