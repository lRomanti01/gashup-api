import mongoose, { Schema, model, Types } from "mongoose";

export interface post extends mongoose.Document {
  typePost_id: Types.ObjectId;
  title: string;
  description: string;
  community_id: Types.ObjectId;
  user_id: Types.ObjectId;
  user_likes: Array<Types.ObjectId>;
  code: string;
  postDate: string;
  images: Array<string>
  isDeleted: boolean;
  isActive: boolean;
  hotScore: number;
}

const postSchema = new Schema({
  typePost_id: {
    type: Schema.Types.ObjectId,
    ref: "TypePost",
    require: false,
  },
  title: {
    type: String,
    require: false,
  },
  description: {
    type: String,
    require: false,
  },
  community_id: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    require: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  user_likes: {
    type: Array<Schema.Types.ObjectId>,
    ref: "User",
    require: false,
  },
  code: {
    type: String,
    require: true,
  },
  postDate: {
    type: String,
    require: true,
  },
  images: {
    type: Array<String>,
    require: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
},
isActive: {
    type: Boolean,
    default: true
},
hotScore: {
  type: Number,
  default:0
},

});

export default model<post>("Post", postSchema);
