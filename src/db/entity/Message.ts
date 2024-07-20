
import mongoose, { Document, model } from "mongoose";

// create message model mongoose
interface IMessage extends Document {
    uid: string;
    from: string;
    subject: string;
    date: string;
    body: string;
}

const messageSchema = new mongoose.Schema<IMessage>({
    from: { type: String },
    uid: { type: String },
    subject: { type: String },
    date: { type: String },
    body: { type: String },
})

const Message = model<IMessage>('Message', messageSchema);


export default Message