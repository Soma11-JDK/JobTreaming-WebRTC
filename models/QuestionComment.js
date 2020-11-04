import mongoose from "mongoose";

const QuestionCommentSchema = new mongoose.Schema({
    writer: {
        type: String,
        required: "writer is required"
    },
    time: {
        type: Date,
        default: Date.now
    },
    context: {
        type: String,
        default: "context is required"
    }
});

const model = mongoose.model("QuestionComment", QuestionCommentSchema);
export default model;