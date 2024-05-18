import mongoose, { Schema, model, Types } from "mongoose";

export interface user extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    img: string;
    isActive: boolean;
    isDeleted: boolean;
    created_at: string;
    updated_at: string;
    role: Types.ObjectId;
}

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: false,
    },
    phone: {
        type: String,
        require: false,
        default: '',
    },
    password: {
        type: String,
        require: true,
    },
    img: {
        type: String,
        require: false,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Roles",
        require: true,
    },
    created_at: {
        type: String,
        default: new Date().toISOString(),
        require: true
    },
    updated_at: {
        type: String,
        default: new Date().toISOString(),
        require: true
    },
    
});

export default model<user>('User', userSchema);