import { Document } from "mongoose"

export interface IStore extends Document {
    storeType: string
    name: string
    status: string
    delete: number
}