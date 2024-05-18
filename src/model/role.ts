import mongoose, { Schema, model } from "mongoose";

export interface role extends mongoose.Document {
  name: string;
  code: string;
}

const roleSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

export default model<role>("Roles", roleSchema);
