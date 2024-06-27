import mongoose, { Schema, model } from "mongoose";

export interface call extends mongoose.Document {
  caller: String,
  callee: String,
  status: String
}

const callSchema = new Schema({
  caller: {
    type: String,
    require: true,
  },
  callee: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
    default:"pending"
  },
});

export default model<call>("Call", callSchema);
