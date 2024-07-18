import mongoose, { Schema, model, Types} from "mongoose";

export interface comments extends mongoose.Document {
  _id?: string;
  description: string;
  user_id: Types.ObjectId;
  post_id: Types.ObjectId;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  commentDate: string;
  user_likes: Array<Types.ObjectId>;
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
  user_likes: {
    type: Array<Schema.Types.ObjectId>,
    ref: "User",
    require: false,
  },
});

export default model<comments>("Comments", commentsSchema);
