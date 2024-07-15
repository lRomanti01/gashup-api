import mongoose, { Schema, model, Types} from "mongoose";

export interface subcomments extends mongoose.Document {
  description: string;
  user_id: Types.ObjectId;
  post_id: Types.ObjectId;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
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
});


export default model<subcomments>("SubComments", subcommentsSchema);
