import mongoose, { Schema, model, Types } from "mongoose";

export interface post extends mongoose.Document {
  typePost: Types.ObjectId;
  title: string;
  description: string;
  community: Types.ObjectId;
  user_id: Types.ObjectId;
  user_likes: Array<Types.ObjectId>;
  code: string;
  postDate: string;
  images: Array<string>
}

const postSchema = new Schema({
  typePost: {
    type: Schema.Types.ObjectId,
    ref: "TypePost",
    require: true,
  },
  title: {
    type: String,
    require: false,
  },
  description: {
    type: String,
    require: false,
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    require: true,
  },
  user: {
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
    require: false,
  },
});

export default model<post>("Post", postSchema);
