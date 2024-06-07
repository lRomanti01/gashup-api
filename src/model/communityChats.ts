import mongoose, { Schema, model, Types} from "mongoose";

export interface communitychats extends mongoose.Document {
  community_id: Types.ObjectId;
  chatOwner_id: Types.ObjectId;
  member_id: Array<Types.ObjectId>;
  name: string;
  img: string;

}

const communitychatsSchema = new Schema({
  community_id: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    require: true,
  },
  chatOwner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  member_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
