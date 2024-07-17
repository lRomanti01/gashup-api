import mongoose, { Schema, model, Types} from "mongoose";

export interface comments extends mongoose.Document {
  description: string;
  user_id: Types.ObjectId;
  post_id: Types.ObjectId;
  commentDate: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
}

const commentsSchema = new Schema({
  description: {
    type: String,
    require: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: "Post",
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
createdAt: {
    type: String,
    default: new Date().toISOString(),
},
  commentDate: {
    type: String,
    require: true,
  },
});

export default model<comments>("Comments", commentsSchema);
