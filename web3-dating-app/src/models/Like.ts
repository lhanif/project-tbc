import mongoose, { Schema, models, model } from "mongoose";

const LikeSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
}, { timestamps: true });

const Like = models.Like || model("Like", LikeSchema);
export default Like;
