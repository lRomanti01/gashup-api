import mongoose, { Schema, model, Types } from "mongoose";

export interface post extends mongoose.Document {
  typePost_id:Types.ObjectId;
  title: string;
  description: string;
  community_id: Types.ObjectId;
  user_id: Types.ObjectId;
  user_likes: Array<Types.ObjectId>;
  code: string;
}

const postSchema = new Schema({
  typePost_id: {
    type: Schema.Types.ObjectId,
    ref: "TypePost",
    require: true,
  },
  title: {
    type: String,
    require: true,
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
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

export default model<post>("Post", postSchema);
