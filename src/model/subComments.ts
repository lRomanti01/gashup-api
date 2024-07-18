import mongoose, { Schema, model, Types} from "mongoose";

export interface subcomments extends mongoose.Document {
  description: string;
  user_id: Types.ObjectId;
  comment_id: Types.ObjectId;
  commentDate: string;
  user_likes: Array<Types.ObjectId>;
}

const subcommentsSchema = new Schema({
  description: {
    type: String,
    require: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  comment_id: {
    type: Schema.Types.ObjectId,
    ref: "Comments",
    require: true,
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

export default model<subcomments>("SubComments", subcommentsSchema);
