import mongoose, { Schema, model, Types} from "mongoose";

export interface communitychats extends mongoose.Document {
  community_id: Types.ObjectId;
  user_id: Types.ObjectId;
  members: string;
  name: string;
  img: string;

}

const communitychatsSchema = new Schema({
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
  members: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  img: {
    type: String,
    require: true,
  },
});

export default model<communitychats>("CommunityChats", communitychatsSchema);
