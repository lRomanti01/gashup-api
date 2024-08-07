import mongoose, { Schema, model, Types } from "mongoose";

export interface community extends mongoose.Document {
    _id: string;
    name: string;
    owner_id: Types.ObjectId;
    description: string;
    img: string;
    banner: string;
    members_id: Array<Types.ObjectId>;
    admins_id: Array<Types.ObjectId>;
    isDeleted: boolean;
    isActive: boolean;
    created_at: string;
    bannedUsers_id: Array<Types.ObjectId>;
    communityCategory_id: Array<Types.ObjectId>;
    hotScore: number;

}

const communitySchema = new Schema({
    name: {
        type: String,
        require: false,
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    description: {
        type: String,
        require: false,
    },
    img: {
        type: String,
    },
    banner: {
        type: String,
    },
    members_id: {
        type: Array<Schema.Types.ObjectId>,
        ref: "User",
    },
    admins_id: {
        type: Array<Schema.Types.ObjectId>,
        ref: "User",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: String,
        default: new Date().toISOString(),
    },
    bannedUsers_id: {
        type: Array<Schema.Types.ObjectId>,
        ref: "User",
    },
    communityCategory_id: {
        type: Array<Schema.Types.ObjectId>,
        ref: "CommunityCategory",
        require: true,
    },
    hotScore: {
        type: Number,
        default: 0,
      },
});

export default model<community>('Community', communitySchema);