import mongoose, { Schema, model } from "mongoose";

export interface communitycategory extends mongoose.Document {
  name: string;
  code: string;
}

const communitycategorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

export default model<communitycategory>("CommunityCategory", communitycategorySchema);
