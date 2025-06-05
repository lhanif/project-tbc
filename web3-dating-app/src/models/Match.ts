import mongoose, { Schema, models, model } from "mongoose";

const MatchSchema = new Schema({
  userA: { type: String, required: true },
  userB: { type: String, required: true },
}, { timestamps: true });

const Match = models.Match || model("Match", MatchSchema);
export default Match;
