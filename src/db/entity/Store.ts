import mongoose, { model } from "mongoose"
import { IStore } from "../../interface/db/Store"

const storeSchema = new mongoose.Schema<IStore>({
    delete: { type: Number },
    name: { type: String },
    status: { type: String },
    storeType: { type: String },
})


const Store = model<IStore>('Store', storeSchema);
export default Store