import mongoose, { Schema, model } from "mongoose";

export interface typepost extends mongoose.Document {
  name: string;
  code: string;
}

const typepostSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

export default model<typepost>("TypePost", typepostSchema);
